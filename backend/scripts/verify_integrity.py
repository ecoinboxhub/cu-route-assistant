#!/usr/bin/env python
"""Verify that the evaluation sets predate the implementation.

This is the integrity gate described in the project plan as risk R1, and it is
the check that separates a measurement from a demonstration. If the gold set can
be shown to have been written after the system it evaluates, no result from
that system is worth anything, regardless of how good the number looks.

It is run in CI so that the guarantee cannot lapse quietly.

Two independent checks, because either alone is defeatable:

  1. Ordering. The sets must have been committed before any implementation.
     This catches the ordinary failure: building the system first, then writing
     tests to match it.

  2. Content. The sets must be byte-identical to their state at that first
     commit.

Check 2 exists because check 1 was found to be insufficient during development.
Check 1 reads the *earliest* commit touching the eval files, so an edit made in
a *later* commit is invisible to it: the earliest commit is still the original
freeze, which of course predates the implementation, so the gate reports PASS on
a set whose expected answers have been rewritten to match the system's output.

That is precisely the failure this gate was built to prevent, and it passed. A
gate that cannot fail is worse than no gate, because it is read as reassurance.
The ordering check answers "was this written first?"; only the content check
answers "is it still what was written first?".

Repository history note
-----------------------
The project was later reorganised into ``backend/`` and ``frontend/``. The
checks therefore look at both the current path and the pre-reorganisation path,
because a pathspec that names only one of them silently starts the clock at the
move, which would make the frozen sets look newer than the implementation.
"""

from __future__ import annotations

import subprocess
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

#: Paths relative to the repository root, current and legacy, for each frozen
#: file. ``:(top)`` makes a pathspec independent of the current working
#: directory, which is ``backend/`` because that is where the script lives.
FROZEN = [
    "eval/gold_set.json",
    "eval/paraphrase_set.json",
    "eval/out_of_scope_set.json",
]
LEGACY_FROZEN = list(FROZEN)
CURRENT_FROZEN = [f"backend/{path}" for path in FROZEN]

#: Paths whose first appearance marks the start of implementation.
IMPL_GLOBS = ["app/**", "scripts/run_eval.py", "scripts/build_index.py", "data/**"]
LEGACY_IMPL = list(IMPL_GLOBS)
CURRENT_IMPL = [f"backend/{path}" for path in IMPL_GLOBS]


def _pathspecs(paths: list[str]) -> list[str]:
    return [f":(top){path}" for path in paths]


def _log(*args: str) -> str:
    return subprocess.run(
        ["git", *args], cwd=ROOT, capture_output=True, text=True, check=True
    ).stdout.strip()


def _first_commit_for(paths: list[str]) -> tuple[str | None, str | None]:
    """Earliest commit timestamp touching any of the given top-level paths."""
    output = subprocess.run(
        [
            "git",
            "log",
            "--reverse",
            "--format=%H|%ad",
            "--date=iso",
            "--",
            *_pathspecs(paths),
        ],
        cwd=ROOT,
        capture_output=True,
        text=True,
    ).stdout.strip()

    if not output:
        return None, None
    first = output.splitlines()[0]
    commit, _, when = first.partition("|")
    return commit, when


def _blob_at(commit: str, candidates: list[str]) -> bytes | None:
    """File content at ``commit``, trying the current then the legacy path."""
    for path in candidates:
        result = subprocess.run(
            ["git", "show", f"{commit}:{path}"],
            cwd=ROOT,
            capture_output=True,
        )
        if result.returncode == 0:
            return result.stdout
    return None


def _blob_hash_at(commit: str, candidates: list[str]) -> str | None:
    """The object id of a file at ``commit``, trying current then legacy paths."""
    for path in candidates:
        result = subprocess.run(
            ["git", "rev-parse", f"{commit}:{path}"],
            cwd=ROOT,
            capture_output=True,
            text=True,
        )
        if result.returncode == 0:
            return result.stdout.strip()
    return None


def _working_hash(path: Path) -> str:
    """The object id git would store for a working-tree file.

    Hashing through git rather than comparing raw bytes matters on Windows:
    ``core.autocrlf`` converts CRLF to LF on staging, so the working tree is not
    byte-identical to the blob even when the content is unchanged. The gate is
    about the repository content, which is what the blob hash captures.
    """
    return subprocess.run(
        ["git", "hash-object", str(path)],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=True,
    ).stdout.strip()


def _drift_from(commit: str) -> list[str]:
    """Describe frozen files whose content differs from the freeze commit.

    Compared against the working tree rather than HEAD so that an uncommitted
    edit is caught too: a tampered file that has not been committed yet is still
    a tampered file, and a gate that inspects only history misses it entirely.
    """
    drift: list[str] = []
    for current, legacy in zip(FROZEN, LEGACY_FROZEN):
        frozen = _blob_hash_at(commit, [f"backend/{current}", legacy])
        if frozen is None:
            drift.append(f"{current}: not present at {commit[:10]}")
            continue
        working_path = ROOT / current
        if not working_path.exists():
            drift.append(f"{current}: missing from the working tree")
            continue
        if _working_hash(working_path) != frozen:
            drift.append(f"{current}: differs from {commit[:10]}")
    return drift


def main() -> int:
    try:
        _log("rev-parse", "HEAD")
    except subprocess.CalledProcessError:
        print("FAIL  not a git repository; integrity cannot be established")
        return 1

    print("CU Route Assistant — evaluation integrity check")
    print("=" * 66)

    eval_commit, eval_when = _first_commit_for(LEGACY_FROZEN + CURRENT_FROZEN)
    if not eval_commit:
        print("FAIL  evaluation sets have never been committed")
        return 1

    impl_commit, impl_when = _first_commit_for(LEGACY_IMPL + CURRENT_IMPL)
    if not impl_commit:
        print("INFO  no implementation commit found yet; the gate cannot be failed")
        print(f"  evaluation frozen at {eval_when}  ({eval_commit[:10]})")
        return 0

    eval_time = datetime.fromisoformat(eval_when)
    impl_time = datetime.fromisoformat(impl_when)

    print(f"  evaluation frozen : {eval_when}  {eval_commit[:10]}")
    print(f"  implementation    : {impl_when}  {impl_commit[:10]}")
    print()

    failures = 0

    # --- check 1: ordering -------------------------------------------------
    if eval_time < impl_time:
        print("  [1/2] order      : PASS - the test set predates the implementation")
    else:
        print("  [1/2] order      : FAIL - the evaluation sets were modified after")
        print("                      implementation began. Every result from this")
        print("                      repository is void. Restore the sets from the")
        print("                      frozen commit and re-run the evaluation with a")
        print("                      new set; do not repair the existing one.")
        failures += 1

    # --- check 2: content --------------------------------------------------
    drift = _drift_from(eval_commit)
    if drift:
        print("  [2/2] content    : FAIL - the frozen sets have changed since they")
        print("                      were first committed:")
        for line in drift:
            print(f"                        {line}")
        print("                      They are expected to be byte-identical to")
        print(f"                      {eval_commit[:10]}. A test set edited after the")
        print("                      fact measures nothing, however good the score.")
        print("                      The sets lived at these paths before the")
        print("                      repository was reorganised, so restore each one")
        print("                      from the freeze commit:")
        for current, legacy in zip(FROZEN, LEGACY_FROZEN):
            print(f"                        git show {eval_commit[:10]}:{legacy} > {current}")
        failures += 1
    else:
        print("  [2/2] content    : PASS - the sets are byte-identical to the freeze")

    print("=" * 66)
    if failures:
        print(f"  RESULT           : FAIL ({failures} of 2 checks failed)")
        print("=" * 66)
        return 1

    print("  RESULT           : PASS - the test set is unmodified and predates the")
    print("                      implementation")
    print("=" * 66)
    return 0


if __name__ == "__main__":
    sys.exit(main())

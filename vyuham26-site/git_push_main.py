import os
import sys
import shutil
from dulwich import porcelain
from dulwich.repo import Repo

TOKEN = sys.argv[1]
REMOTE_URL = f"https://{TOKEN}@github.com/vyuham26-cmyk/Vyuham2026.git"
CLONE_DIR = r"c:\Users\Administrator\Desktop\website\repo_clone"
SOURCE_DIR = r"c:\Users\Administrator\Desktop\website\Vyuham2026-main\Vyuham2026-main\vyuham26-site"
AUTHOR = b"Vyuham26 <vyuham26@klnce.edu>"

if os.path.exists(CLONE_DIR):
    shutil.rmtree(CLONE_DIR, ignore_errors=True)

print("Cloning repo...")
repo = porcelain.clone(REMOTE_URL, CLONE_DIR)

print("Copying updated files...")
target_site_dir = os.path.join(CLONE_DIR, "vyuham26-site")
if not os.path.exists(target_site_dir):
    os.makedirs(target_site_dir)

# Copy everything from SOURCE_DIR to target_site_dir
for item in os.listdir(SOURCE_DIR):
    s = os.path.join(SOURCE_DIR, item)
    d = os.path.join(target_site_dir, item)
    if os.path.isdir(s):
        if item in {'.git', '__pycache__', 'node_modules'}:
            continue
        if os.path.exists(d):
            shutil.rmtree(d)
        shutil.copytree(s, d)
    else:
        if item in {'git_push.py', 'replace_script.py', 'verify.py', 'git-installer.exe', 'extracted_rules.txt'}:
            continue
        shutil.copy2(s, d)

os.chdir(CLONE_DIR)

print("Adding files to git...")
porcelain.add(repo, "vyuham26-site")

print("Committing...")
commit_id = porcelain.commit(
    repo,
    message=b"Updated website: header, rules, registration link, removed Mindspark",
    author=AUTHOR,
    committer=AUTHOR
)
print(f"Commit: {commit_id.decode()}")

print("Pushing to main...")
porcelain.push(
    repo,
    remote_location=REMOTE_URL,
    refspecs=b"refs/heads/main:refs/heads/main",
)
print("Push successful!")

import os
import subprocess

ROOT = os.path.dirname(__file__)
INDEX_TEMPLATE_PATH = os.path.join(ROOT, "src", "index.html")
CSS_PATH = os.path.join(ROOT, "src", "style.css")
OUTPUT_PATH = os.path.join(ROOT, "index.html")

def main():
  with open(INDEX_TEMPLATE_PATH) as f:
    template = f.read()
  css = subprocess.check_output([
    "npx",
    "tailwindcss",
    "-i",
    CSS_PATH,
  ]).decode("utf8")
  index_souce = template.format(css=css)
  with open(OUTPUT_PATH, "w") as f:
    f.write(index_souce)

if __name__ == "__main__":
  main()

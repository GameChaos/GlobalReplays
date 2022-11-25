
import shutil
import os
import glob
import time

def CopyDirectoryFiles(src, dst):
	if os.path.exists(dst):
		if not os.path.isdir(dst):
			print("CopyDirectoryFiles() Invalid directory path: ", dst)
			return
	else:
		os.makedirs(dst)
	
	files = glob.glob(src)
	if files:
		for f in files:
			shutil.copy(f, dst)

def main():
	
	files = glob.glob('build/*')
	if files:
		for f in files:
			if os.path.isfile(f):
				os.remove(f)
			elif os.path.isdir(f):
				shutil.rmtree(f)
	
	if not os.path.exists("build/"):
		os.makedirs("build/")
	
	CopyDirectoryFiles("images/*", "build/images/")
	CopyDirectoryFiles("js/*", "build/js/")
	CopyDirectoryFiles("styles/*", "build/styles/")
	
	version = "%x" % int(time.time())
	with open("index.html", "r") as file:
		checksum = 0
		data = file.read()
		file.close()
		replaced = data.replace("${VERSION}", version)
		out = open("build/index.html", "w")
		out.write(replaced)
		out.close()

if __name__ == "__main__":
	main()
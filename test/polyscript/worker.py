from polyscript import xworker
python = xworker.python
pyimport = xworker.pyimport
document = xworker.window.document

print('Hello, world!')
document.body.append('Hello world!')

python.print('Hello, world!')

sys = pyimport('sys')
print(sys.version)

os = pyimport('os')
print(os.getcwd())

# lists on server
os.system('ls')

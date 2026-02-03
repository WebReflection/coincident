# regular PyScript related imports
from pyscript import window, document, js_import

# actual Python running on the server 🤯
from server import json, os, platform, psutil, sys, print as log

# it prints on the server console/stdout + browser console
print('Hello Browser 👋')
log('Hello Server 👋')

# retrieve memory information + log on the server console
memory_info = psutil.virtual_memory()
log(memory_info)

# example: load locally a remote JSON dump
from json import loads
memory = loads(json.dumps(memory_info))

# show details on the browser UI
document.body.innerHTML = f"""
  <h2>🤖 System Details</h2>
  <ul>
    <li>Platform: {sys.platform}</li>
    <li>Arch: {platform.machine()}</li>
    <li>CPUS: {os.cpu_count()}</li>
    <li>RAM: {memory[0]}</li>
    <li>Free: {memory[1]}</li>
  </ul>
"""

# import any JS module with ease
JSConfetti = (await js_import('https://esm.run/js-confetti')).default
confetti = JSConfetti.new()
confetti.addConfetti()

def add_confetti(event):
    # it prints on the server console/stdout + browser console
    print('Confetti Browser 👋')
    log('Confetti Server 👋')

    # show confetti on the browser
    confetti.addConfetti()

# add event listener to the document element
document.documentElement.onclick = add_confetti

import urllib.request
import json
import base64
import sys

token = "YOUR_GITHUB_TOKEN"
url = "https://api.github.com/repos/vyuham26-cmyk/Vyuham2026/contents/vyuham26-site/index.html"

req = urllib.request.Request(url)
req.add_header('Authorization', f'Bearer {token}')
req.add_header('Accept', 'application/vnd.github.v3+json')
req.add_header('User-Agent', 'Python-urllib')

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        sha = data['sha']
        print(f"SHA: {sha}")
        
        with open('index.html', 'rb') as f:
            content = f.read()
            
        encoded_content = base64.b64encode(content).decode('utf-8')
        
        update_data = {
            "message": "Reduce font size of hero text for mobile",
            "content": encoded_content,
            "sha": sha
        }
        
        update_req = urllib.request.Request(url, method='PUT')
        update_req.add_header('Authorization', f'Bearer {token}')
        update_req.add_header('Accept', 'application/vnd.github.v3+json')
        update_req.add_header('User-Agent', 'Python-urllib')
        update_req.add_header('Content-Type', 'application/json')
        
        with urllib.request.urlopen(update_req, data=json.dumps(update_data).encode('utf-8')) as update_response:
            update_res_data = json.loads(update_response.read().decode())
            print(f"Success! URL: {update_res_data['commit']['html_url']}")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

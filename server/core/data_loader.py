import json
import os
import urllib.request
import numpy as np

def load_json(file_path):
    with open(file_path, 'r') as f:
        data = json.load(f)
    video_data = []
    for d in data:
        gloss = d['gloss']
        for instance in d['instances']:
            video_info = {
                'gloss': gloss,
                'video_id': instance['video_id'],
                'url': instance['url']
            }
            video_data.append(video_info)
    return data, video_data

def download_video(url, save_path):
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    
    # Check if the video file already exists
    if os.path.exists(save_path):
        print(f"File already exists: {save_path}")
        return 
    try:
        urllib.request.urlretrieve(url, save_path)
        print(f"Successfully downloaded {save_path}")
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: Unable to download {url}. File not saved.")
    except Exception as e:
        print(f"Error occurred while downloading {url}: {e}")

def extract_video_data(data):
    """Extract video URLs and gloss from the JSON data."""
    video_data = []
    for item in data:
        gloss = item['gloss']
        for instance in item['instances']:
            video_info = {
                'gloss': gloss,
                'video_id': instance['video_id'],
                'url': instance['url']
            }
            video_data.append(video_info)
    return video_data

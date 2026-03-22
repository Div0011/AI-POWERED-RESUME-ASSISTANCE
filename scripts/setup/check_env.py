#!/usr/bin/env python3
"""Check environment variables"""
import os
from dotenv import load_dotenv

load_dotenv()

dev_mode = os.getenv("DEV_MODE")
print(f"DEV_MODE: {dev_mode}")
print(f"Type: {type(dev_mode)}")
print(f"Bool check: {dev_mode and dev_mode.lower() == 'true'}")

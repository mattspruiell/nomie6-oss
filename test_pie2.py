from playwright.sync_api import sync_playwright

def run_cuj(page):
    # Just navigate and take a screenshot when it's done loading, avoid waiting for full load if it hangs
    page.goto("http://localhost:5001", wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(5000) # Wait for page to render

    # Check if we see a pie chart in dashboard or something
    page.screenshot(path="/home/jules/verification/screenshots/verification.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    import os
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)
    os.makedirs("/home/jules/verification/videos", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="/home/jules/verification/screenshots/verification.png")
        finally:
            context.close()
            browser.close()

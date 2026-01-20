
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to portfolio page...")
            page.goto("http://localhost:3000/portfolio")

            # Wait for content to load
            print("Waiting for 'Software Architect' text...")
            page.wait_for_selector("text=Software Architect", timeout=60000)

            # Wait a bit for Three.js to render (though we can't easily check canvas content via selector, we can check its presence)
            print("Waiting for canvas...")
            page.wait_for_selector("canvas", timeout=10000)

            print("Taking screenshot...")
            page.screenshot(path="verification/portfolio.png")
            print("Screenshot saved to verification/portfolio.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()

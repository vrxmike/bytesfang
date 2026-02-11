from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 375, "height": 667}) # iPhone SE dimensions

        try:
            print("Navigating to homepage...")
            page.goto("http://localhost:3000")
            page.wait_for_load_state("networkidle")

            # Screenshot 1: Mobile Homepage (checking layout & menu button)
            print("Taking homepage screenshot...")
            page.screenshot(path="verification/1-mobile-home.png")

            # Action: Open Mobile Menu
            print("Opening mobile menu...")
            menu_btn = page.locator("button:has(svg.lucide-menu)")
            if menu_btn.is_visible():
                menu_btn.click()
                page.wait_for_timeout(500) # Wait for animation
                print("Taking menu screenshot...")
                page.screenshot(path="verification/2-mobile-menu.png")
            else:
                print("Menu button not found!")

            # Action: Scroll to check Projects layout & ScrollToTop
            print("Closing menu and scrolling...")
            # Click outside/close menu if open, or just reload/reset
            page.reload()
            page.wait_for_load_state("networkidle")

            # Scroll down to Projects
            page.evaluate("window.scrollTo(0, 1000)")
            page.wait_for_timeout(500)
            print("Taking projects screenshot...")
            page.screenshot(path="verification/3-mobile-projects.png")

            # Scroll further to trigger ScrollToTop
            page.evaluate("window.scrollTo(0, 2000)")
            page.wait_for_timeout(500)
            print("Taking scroll-to-top screenshot...")
            page.screenshot(path="verification/4-scroll-to-top.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()

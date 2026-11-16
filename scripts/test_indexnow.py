"""Offline IndexNow tests. No external HTTP calls or credits."""
import importlib.util
from pathlib import Path
from unittest import TestCase, main

script = Path(__file__).resolve().parent / "indexnow-submit.py"
spec = importlib.util.spec_from_file_location("indexnow_submit", script)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


class IndexNowTests(TestCase):
    def test_home_and_directory(self):
        self.assertEqual(mod.file_to_url("index.html"), "https://digital.lazyplex.com/")
        self.assertEqual(mod.file_to_url("services/lead-generation/index.html"),
                         "https://digital.lazyplex.com/services/lead-generation/")
        self.assertIsNone(mod.file_to_url("assets/main.js"))

    def test_validation_and_duplicate_removal(self):
        urls = mod.validate_urls(["https://digital.lazyplex.com/",
                                  "https://digital.lazyplex.com/",
                                  "https://digital.lazyplex.com/approach/"])
        self.assertEqual(len(urls), 2)

    def test_deny_mixed_hosts_query_urls_and_userinfo(self):
        for url in ["https://www.digital.lazyplex.com/",
                    "https://example.com/", "http://digital.lazyplex.com/",
                    "https://digital.lazyplex.com/?private=1",
                    "https://someone@digital.lazyplex.com/"]:
            with self.subTest(url=url), self.assertRaises(ValueError):
                mod.validate_urls([url])

    def test_sitemap_and_seed(self):
        current = mod.sitemap_urls(mod.SITEMAP_FILE.read_bytes())
        seed = mod.validate_urls(mod.SEED_FILE.read_text().splitlines())
        self.assertEqual(len(current), 102)
        self.assertEqual(len(set(current)), 102)
        self.assertEqual(len(seed), 29)
        self.assertTrue(set(seed).issubset(set(current)))
        self.assertEqual(mod.KEY_FILE.read_text(), mod.KEY)


if __name__ == "__main__":
    main(verbosity=2)

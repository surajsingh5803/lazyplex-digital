<?php
/**
 * Plugin Name: Lazy Plex Unified Brand
 * Description: Brings lazyplex.com into the same visual family as digital.lazyplex.com while preserving WordPress and Elementor content, WooCommerce, forms and URL structure.
 * Version: 2.0.0
 * Author: Lazy Plex
 * License: GPL-2.0-or-later
 */

if (!defined('ABSPATH')) { exit; }

/** Don't create a second header on purpose-built Elementor Canvas pages. */
function lp_brand_use_shared_shell() {
    if (is_admin() || is_feed() || is_404()) return false;
    return !is_page(array('coaching'));
}

add_action('wp_enqueue_scripts', function () {
    if (is_admin()) return;
    wp_enqueue_style(
        'lazyplex-unified-brand',
        plugins_url('assets/lazyplex-unified.css', __FILE__),
        array(),
        '2.0.0',
        'all'
    );
}, 60);

/** Assigned WordPress menus are the single source of truth. */
function lp_brand_render_menu($location, $id, $class) {
    wp_nav_menu(array(
        'theme_location' => $location,
        'container' => false,
        'menu_id' => $id,
        'menu_class' => $class,
        'fallback_cb' => false,
        'depth' => 2,
    ));
}

add_action('wp_body_open', function () {
    if (!lp_brand_use_shared_shell()) return;
    ?>
    <a class="lpbrand-skip" href="#lpbrand-content-start">Skip to main content</a>
    <header class="lpbrand-header" role="banner">
      <div class="lpbrand-container lpbrand-nav">
        <a class="lpbrand-wordmark" href="<?php echo esc_url(home_url('/')); ?>" aria-label="Lazy Plex home">
          <span class="lpbrand-mark"><img width="42" height="42" alt="Lazy Plex" loading="eager" decoding="async" src="https://digital.lazyplex.com/assets/lazyplex-logo.webp"></span>
          <span class="lpbrand-name">LAZY PLEX <small>BUSINESS · TECHNOLOGY · INNOVATION</small></span>
        </a>
        <nav class="lpbrand-desktop" aria-label="Main navigation">
          <?php lp_brand_render_menu('menu-1', 'lpbrand-corporate-nav', 'lpbrand-menu'); ?>
        </nav>
        <details class="lpbrand-mobile" aria-label="Mobile navigation">
          <summary aria-label="Open navigation"><span></span><span></span><span></span><b>Menu</b></summary>
          <nav aria-label="Mobile site menu">
            <?php lp_brand_render_menu('menu-1', 'lpbrand-mobile-nav', 'lpbrand-menu'); ?>
          </nav>
        </details>
      </div>
    </header>
    <span id="lpbrand-content-start" tabindex="-1" class="lpbrand-skip-target"></span>
    <?php
}, 5);

add_action('wp_footer', function () {
    if (!lp_brand_use_shared_shell()) return;
    ?>
    <footer class="lpbrand-footer" role="contentinfo">
      <div class="lpbrand-container lpbrand-footer-intro">
        <a href="<?php echo esc_url(home_url('/')); ?>" aria-label="Lazy Plex home"><strong>LAZY PLEX<span>.</span></strong></a>
        <p>Business. Technology. Innovation. Explore Lazy Plex Digital, Lazy Plex Software and Lazy Plex Labs.</p>
      </div>
      <nav class="lpbrand-container lpbrand-footer-nav" aria-label="Footer navigation">
        <?php lp_brand_render_menu('menu-2', 'lpbrand-corporate-footer', 'lpbrand-footer-menu'); ?>
      </nav>
      <div class="lpbrand-container lpbrand-bottom">
        <span>© <?php echo esc_html(gmdate('Y')); ?> Lazy Plex. All rights reserved.</span>
        <span><a href="mailto:plexlazy@gmail.com">plexlazy@gmail.com</a> · <a href="tel:+917257919567">+91 72579 19567</a></span>
      </div>
    </footer>
    <?php
}, 85);

/** Add a context class so the overrides never affect WP Admin. */
add_filter('body_class', function($classes) {
    $classes[] = lp_brand_use_shared_shell() ? 'lpbrand-has-shell' : 'lpbrand-standalone';
    return $classes;
});

/** Ensure Hello Elementor does not emit a redundant H1 on authored parent-brand pages. */
add_filter('hello_elementor_page_title', function($show) {
    if (is_front_page() || is_page(array('industries','healthcare','software','about-new','about','solutions','get-customers','convert','automate','measure','services','pricing','growth-consultancy','real-estate','education','ecommerce','beauty-wellness','hospitality','manufacturing-b2b','professional-services','startups-smes','labs','insights','contact','leadership','our-approach','businesses','products','luma-circuit','partnerships','product-support'))) return false;
    return $show;
}, 99);
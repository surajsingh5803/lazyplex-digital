<?php
/**
 * Plugin Name: Lazy Plex Unified Brand
 * Description: Brings lazyplex.com into the same visual family as digital.lazyplex.com while preserving WordPress and Elementor content, WooCommerce, forms and URL structure.
 * Version: 1.3.0
 * Author: Lazy Plex
 * License: GPL-2.0-or-later
 */

if (!defined('ABSPATH')) { exit; }

/** Don't create a second header on purpose-built Elementor Canvas pages. */
function lp_brand_use_shared_shell() {
    if (is_admin() || is_feed() || is_404()) return false;
    return !is_page(array('growth-consultancy', 'coaching'));
}

add_action('wp_enqueue_scripts', function () {
    if (is_admin()) return;
    wp_enqueue_style(
        'lazyplex-unified-brand',
        plugins_url('assets/lazyplex-unified.css', __FILE__),
        array(),
        '1.3.0',
        'all'
    );
}, 60);

function lp_brand_link($href, $label, $class = '') {
    printf('<a href="%s" class="%s">%s</a>',
        esc_url($href), esc_attr($class), esc_html($label));
}

/**
 * Render a header through the supported wp_body_open action. This avoids
 * modifying Elementor page HTML, database meta, forms or plugins.
 */
add_action('wp_body_open', function () {
    if (!lp_brand_use_shared_shell()) return;
    $home = home_url('/');
    $main = array(
        array('Solutions', home_url('/solutions/')),
        array('Industries', home_url('/industries/')),
        array('Services', home_url('/services/')),
        array('Pricing', home_url('/pricing/')),
        array('Digital', 'https://digital.lazyplex.com/services/'),
        array('Software', home_url('/software/')),
        array('About', home_url('/about/')),
    );
    ?>
    <a class="lpbrand-skip" href="#lpbrand-content-start">Skip to main content</a>
    <header class="lpbrand-header" role="banner">
      <div class="lpbrand-container lpbrand-nav">
        <a class="lpbrand-wordmark" href="<?php echo esc_url($home); ?>" aria-label="Lazy Plex home">
          <span class="lpbrand-mark"><img width="42" height="42" alt="Lazy Plex" loading="eager" decoding="async" src="https://digital.lazyplex.com/assets/lazyplex-logo.webp"></span>
          <span class="lpbrand-name">LAZY PLEX <small>GROWTH SYSTEMS</small></span>
        </a>
        <nav class="lpbrand-desktop" aria-label="Main navigation">
          <?php foreach ($main as $item) { lp_brand_link($item[1], $item[0]); } ?>
          <a class="lpbrand-phone" href="tel:+917257919567">Call: 72579 19567</a>
          <a class="lpbrand-cta" href="<?php echo esc_url(home_url('/contact/')); ?>">Let's talk <span aria-hidden="true">↗</span></a>
        </nav>
        <details class="lpbrand-mobile" aria-label="Mobile navigation">
          <summary aria-label="Open navigation"><span></span><span></span><span></span><b>Menu</b></summary>
          <nav aria-label="Mobile site menu">
            <?php lp_brand_link($home, 'Home'); ?>
            <?php foreach ($main as $item) { lp_brand_link($item[1], $item[0]); } ?>
            <?php lp_brand_link(home_url('/healthcare/'), 'Healthcare Growth'); ?>
            <?php lp_brand_link(home_url('/real-estate/'), 'Real Estate Growth'); ?>
            <?php lp_brand_link(home_url('/how-it-works/'), 'How It Works'); ?>
            <?php lp_brand_link(home_url('/growth-audit/'), 'Get Your Growth Audit'); ?>
            <?php lp_brand_link(home_url('/contact/'), 'Contact'); ?>
            <a href="tel:+917257919567">Call +91 72579 19567</a>
          </nav>
        </details>
      </div>
    </header>
    <span id="lpbrand-content-start" tabindex="-1" class="lpbrand-skip-target"></span>
    <?php
}, 5);

/** Footer for the shared shell; leave WooCommerce and Elementor content intact. */
add_action('wp_footer', function () {
    if (!lp_brand_use_shared_shell()) return;
    ?>
    <footer class="lpbrand-footer" role="contentinfo">
      <div class="lpbrand-container lpbrand-footer-grid">
        <div class="lpbrand-footer-intro">
          <strong>LAZY PLEX<span>.</span></strong>
          <p>Get Customers → Convert Customers → Automate Operations → Measure Growth. Consulting, specialist Digital services and technology for nine industries.</p>
          <a href="https://heysuraj.com/" rel="noopener noreferrer">Meet the founder ↗</a>
        </div>
        <div><h2>Explore</h2>
          <a href="<?php echo esc_url(home_url('/solutions/')); ?>">Growth solutions</a>
          <a href="<?php echo esc_url(home_url('/services/')); ?>">Choose individual services</a>
          <a href="<?php echo esc_url(home_url('/pricing/')); ?>">Packages and pricing</a>
          <a href="https://digital.lazyplex.com/services/">Lazy Plex Digital</a>
          <a href="<?php echo esc_url(home_url('/industries/')); ?>">All nine industries</a>
          <a href="<?php echo esc_url(home_url('/software/')); ?>">Software & products</a>
          <a href="https://estatecrm.lazyplex.com/">Estate CRM</a>
        </div>
        <div><h2>Company</h2>
          <a href="<?php echo esc_url(home_url('/about/')); ?>">About Lazy Plex</a>
          <a href="<?php echo esc_url(home_url('/insights/')); ?>">Insights</a>
          <a href="<?php echo esc_url(home_url('/growth-audit/')); ?>">Growth audit</a>
          <a href="<?php echo esc_url(home_url('/get-customers/')); ?>">Get Customers</a>
          <a href="<?php echo esc_url(home_url('/convert/')); ?>">Convert Customers</a>
          <a href="<?php echo esc_url(home_url('/automate/')); ?>">Automate Operations</a>
          <a href="<?php echo esc_url(home_url('/measure/')); ?>">Measure Growth</a>
          <a href="<?php echo esc_url(home_url('/contact/')); ?>">Contact</a>
          <a href="https://digital.lazyplex.com/work/">Our work</a>
        </div>
        <div><h2>Get in touch</h2>
          <a href="tel:+917257919567">+91 72579 19567</a>
          <a href="mailto:plexlazy@gmail.com">plexlazy@gmail.com</a>
          <a href="https://wa.me/917257919567?text=Hi%20Lazy%20Plex%2C%20I%20would%20like%20to%20discuss%20a%20project." target="_blank" rel="noopener noreferrer">Chat on WhatsApp ↗</a>
        </div>
      </div>
      <nav class="lpbrand-container lpbrand-industry-nav" aria-label="Explore growth systems by industry">
        <strong>Industries</strong>
        <?php foreach (array(
          array('Real Estate','/real-estate/'),array('Healthcare','/healthcare/'),array('Education & EdTech','/industries/education/'),
          array('E-commerce & D2C','/industries/ecommerce/'),array('Beauty & Wellness','/industries/beauty-wellness/'),
          array('Hospitality & Travel','/industries/hospitality/'),array('Manufacturing & B2B','/industries/manufacturing-b2b/'),
          array('Professional Services','/industries/professional-services/'),array('Startups & SMEs','/industries/startups-smes/')
        ) as $sector) { lp_brand_link(home_url($sector[1]),$sector[0]); } ?>
      </nav>
      <div class="lpbrand-container lpbrand-bottom"><span>© <?php echo esc_html(gmdate('Y')); ?> Lazy Plex. All rights reserved.</span><span>One brand. Connected growth.</span></div>
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
    if (is_front_page() || is_page(array('industries','healthcare','software','about-new','about','solutions','get-customers','convert','automate','measure','services','pricing','real-estate','education','ecommerce','beauty-wellness','hospitality','manufacturing-b2b','professional-services','startups-smes'))) return false;
    return $show;
}, 99);
<?php
/**
 * Plugin Name: Lazy Plex Main Site SEO Bridge
 * Description: Main WordPress site only: OpenSEO key, AI discovery and Rank Math metadata. No changes to the digital subdomain.
 * Version: 1.0.1
 * Author: Lazy Plex
 * License: GPL-2.0-or-later
 */
if (!defined('ABSPATH')) { exit; }
function lp_main_seo_document_endpoint() {
    if (wp_parse_url(home_url('/'), PHP_URL_HOST) !== 'lazyplex.com') { return; }
    $uri = isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '/';
    $path = wp_parse_url($uri, PHP_URL_PATH);
    $key = '0f54c7b2013f41a8a041d3d62c44ff41';
    if ($path === '/' . $key . '.txt') {
        status_header(200);
        header('Content-Type: text/plain; charset=utf-8');
        header('X-Content-Type-Options: nosniff');
        header('Cache-Control: public, max-age=300');
        echo $key;
        exit;
    }
    if ($path === '/llms.txt') {
        status_header(200);
        header('Content-Type: text/plain; charset=utf-8');
        header('X-Content-Type-Options: nosniff');
        echo "# Lazy Plex\n\nLazy Plex is a growth consultancy connecting SEO, digital marketing, CRM automation, lead quality, customer conversion and measurable business systems. The main corporate website runs at https://lazyplex.com/; its separate digital resources site is https://digital.lazyplex.com/.\n\n## Corporate pages\n- https://lazyplex.com/\n- https://lazyplex.com/about/\n- https://lazyplex.com/solutions/\n- https://lazyplex.com/growth-consultancy/\n- https://lazyplex.com/real-estate/\n- https://lazyplex.com/how-it-works/\n- https://lazyplex.com/growth-audit/\n- https://lazyplex.com/contact/\n\n## Digital knowledge hub\n- https://digital.lazyplex.com/services/\n- https://digital.lazyplex.com/industries/\n- https://digital.lazyplex.com/industries/healthcare/\n- https://digital.lazyplex.com/industries/real-estate/\n- https://digital.lazyplex.com/insights/\n- https://digital.lazyplex.com/tools/\n\nEducational examples and descriptions do not guarantee outcomes or imply unauthorised client endorsements.\n";
        exit;
    }
}
add_action('init', 'lp_main_seo_document_endpoint', 1);
function lp_main_seo_sync_files() {
    if (wp_parse_url(home_url('/'), PHP_URL_HOST) !== 'lazyplex.com') { return; }
    $root = rtrim(ABSPATH, '/\\') . '/';
    $key = '0f54c7b2013f41a8a041d3d62c44ff41';
    $keyfile = $root . $key . '.txt';
    if (!is_file($keyfile) || @file_get_contents($keyfile) !== $key) {
        @file_put_contents($keyfile, $key, LOCK_EX);
    }
    $llms = $root . 'llms.txt';
    if (!is_file($llms)) {
        $description = "# Lazy Plex\n\nLazy Plex is a growth consultancy connecting marketing, SEO, AI automation, CRM and business measurement. The corporate website is https://lazyplex.com/ and the separate specialist resources website is https://digital.lazyplex.com/.\n\n## Main pages\n- https://lazyplex.com/\n- https://lazyplex.com/about/\n- https://lazyplex.com/solutions/\n- https://lazyplex.com/growth-consultancy/\n- https://lazyplex.com/real-estate/\n- https://lazyplex.com/contact/\n\n## Specialist resources\n- https://digital.lazyplex.com/services/\n- https://digital.lazyplex.com/industries/\n- https://digital.lazyplex.com/insights/\n";
        @file_put_contents($llms, $description, LOCK_EX);
    }
}
register_activation_hook(__FILE__, 'lp_main_seo_sync_files');
add_action('init', function () {
    if (!get_option('lp_main_seo_files_synced_v101')) {
        lp_main_seo_sync_files();
        update_option('lp_main_seo_files_synced_v101', 1, false);
    }
}, 3);

function lp_main_seo_metadata_map() {
    return array(
        16 => array('title'=>'Lazy Plex | Growth Consultancy & Digital Marketing Systems','description'=>'Lazy Plex connects SEO, digital marketing, lead generation, CRM automation and analytics into measurable business growth systems.'),
        55 => array('title'=>'About Lazy Plex | Growth Consultancy & Automation','description'=>'Meet Lazy Plex: a growth consultancy connecting digital strategy, acquisition, automation and performance measurement across business sectors.'),
        22 => array('title'=>'Business Growth Solutions | Marketing, CRM & SEO | Lazy Plex','description'=>'Explore Lazy Plex solutions for qualified customer acquisition, lead conversion, CRM automation, SEO and meaningful growth measurement.'),
        40 => array('title'=>'Real Estate Marketing Systems for Developers | Lazy Plex','description'=>'Connect real estate marketing, buyer qualification, CRM follow-up, site visits and revenue measurement in one practical growth system.'),
        49 => array('title'=>'Growth Insights & Marketing Resources | Lazy Plex','description'=>'Explore practical marketing, customer acquisition, lead conversion, automation and measurement insights from Lazy Plex and its digital hub.'),
        157 => array('title'=>'Contact Lazy Plex | Digital Marketing & Growth Consultancy','description'=>'Contact Lazy Plex to discuss SEO, digital marketing, qualified leads, CRM automation and measurable growth. Start with a practical growth audit.'),
        254 => array('title'=>'Coaching Institute Websites & Lead Generation | Lazy Plex','description'=>'Build an admissions-focused website for your coaching institute. Explore lead generation, student enquiries and enrolment journeys with Lazy Plex.'),
        287 => array('title'=>'Growth Consultancy & Business Marketing Systems | Lazy Plex','description'=>'Explore Lazy Plex growth consultancy: digital strategy, acquisition, customer conversion, automation and measurement built around business goals.'),
        46 => array('title'=>'Business Growth Audit | Identify Sales & Marketing Gaps | Lazy Plex','description'=>'Request a growth audit to understand acquisition, lead quality, conversion, CRM follow-up and measurement gaps before scaling spend.')
    );
}
add_filter('rank_math/frontend/title', function($title) {
    if (!is_page()) return $title;
    $map = lp_main_seo_metadata_map(); $id = get_queried_object_id();
    return isset($map[$id]) ? $map[$id]['title'] : $title;
}, 99);
add_filter('rank_math/frontend/description', function($description) {
    if (!is_page()) return $description;
    $map = lp_main_seo_metadata_map(); $id = get_queried_object_id();
    return isset($map[$id]) ? $map[$id]['description'] : $description;
}, 99);
add_filter('rank_math/frontend/robots', function($robots) {
    if (is_page(array(217,218,219,220)) || is_post_type_archive('product') || is_category('uncategorized') || is_singular('product')) {
        $robots['index'] = 'noindex'; $robots['follow'] = 'follow';
    }
    return $robots;
}, 99);
add_action('template_redirect', function() {
    $path = wp_parse_url(isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '/', PHP_URL_PATH);
    $redirects = array('/elementor-287/' => '/growth-consultancy/', '/hello-world/' => '/insights/', '/digital-bundle/' => '/solutions/', '/digital-bundle-thank-you/' => '/solutions/');
    if (isset($redirects[$path])) { wp_safe_redirect(home_url($redirects[$path]), 301); exit; }
}, 1);

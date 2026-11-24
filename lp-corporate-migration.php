<?php
/**
 * Plugin Name: Lazy Plex Corporate Migration
 * Description: Explicit old-to-new marketing URL redirects. Activate only after all Digital destination pages are publicly verified.
 * Version: 1.1.1
 * License: GPL-2.0-or-later
 */
defined('ABSPATH') || exit;
function lp_corporate_migration_routes() {
    return array(
        '/solutions/' => '/pricing/#packages',
        '/growth-consultancy/' => '/approach/',
        '/pricing/' => '/pricing/',
        '/services/' => '/services/',
        '/compare/' => '/pricing/#packages',
        '/pricing-preview/' => '/pricing/',
        '/start/' => '/growth-planner/',
        '/growth-advisor/' => '/growth-planner/',
        '/request-growth-audit/' => '/growth-planner/',
        '/growth-audit/' => '/growth-planner/',
        '/request-proposal/' => '/contact/?service=integrated-growth',
        '/working-together/' => '/approach/',
        '/how-it-works/' => '/approach/',
        '/get-customers/' => '/pricing/#packages',
        '/convert/' => '/services/conversion-optimisation/',
        '/automate/' => '/services/crm-automation/',
        '/measure/' => '/services/analytics-reporting/',
        '/our-work/' => '/work/',
        '/growth-example/' => '/work/',
        '/industries/' => '/industries/',
        '/healthcare/' => '/industries/healthcare/',
        '/real-estate/' => '/industries/real-estate/',
        '/industries/education/' => '/industries/education/',
        '/industries/ecommerce/' => '/industries/ecommerce/',
        '/industries/beauty-wellness/' => '/industries/beauty-wellness/',
        '/industries/hospitality/' => '/industries/hospitality/',
        '/industries/manufacturing-b2b/' => '/industries/manufacturing-b2b/',
        '/industries/professional-services/' => '/industries/professional-services/',
        '/industries/startups-smes/' => '/industries/startups-smes/',
        '/how-to-choose-digital-marketing-agency/' => '/insights/how-to-choose-digital-marketing-agency/',
        '/small-business-digital-marketing-budget-india/' => '/insights/small-business-digital-marketing-budget-india/',
        '/seo-vs-google-ads-vs-meta-ads-service-business/' => '/insights/seo-vs-google-ads-vs-meta-ads-service-business/',
        '/why-marketing-leads-not-converting/' => '/insights/why-marketing-leads-not-converting/',
        '/healthcare-marketing-strategy-clinics-hospitals/' => '/insights/healthcare-marketing-strategy-clinics-hospitals/',
        '/real-estate-marketing-strategy-developers-site-visits/' => '/insights/real-estate-marketing-strategy-developers-site-visits/',
        '/seo-ai-search-businesses-2026-guide/' => '/insights/seo-ai-search-businesses-2026-guide/',
        '/how-to-measure-marketing-roi-leads-revenue/' => '/insights/how-to-measure-marketing-roi-leads-revenue/',
    );
}
add_action('template_redirect', static function () {
    if (is_admin() || is_preview() || wp_doing_ajax() || (defined('REST_REQUEST') && REST_REQUEST)) { return; }
    $method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : '';
    if (!in_array($method, array('GET','HEAD'), true)) { return; }
    $host = wp_parse_url(home_url('/'), PHP_URL_HOST);
    if ($host !== 'lazyplex.com' && $host !== 'staging-9b98-winbuzzgame.wpcomstaging.com') { return; }
    $raw = isset($_SERVER['REQUEST_URI']) ? wp_unslash($_SERVER['REQUEST_URI']) : '';
    $path = wp_parse_url($raw, PHP_URL_PATH);
    if (!is_string($path)) { return; }
    $path = '/' . trim($path, '/') . '/';
    $routes = lp_corporate_migration_routes();
    if (!isset($routes[$path])) { return; }
    $target = 'https://digital.lazyplex.com' . $routes[$path];
    $campaign = array();
    foreach (array('utm_source','utm_medium','utm_campaign','utm_content','utm_term') as $key) {
        if (isset($_GET[$key]) && is_string($_GET[$key])) {
            $value = wp_unslash($_GET[$key]);
            if (preg_match('/^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,47}$/D', $value)) { $campaign[$key] = $value; }
        }
    }
    if ($campaign) { $target = add_query_arg($campaign, $target); }
    wp_redirect($target, $host === 'lazyplex.com' ? 301 : 302, 'Lazy Plex Corporate Migration');
    exit;
}, 1);

// Exclude transferred URLs from Rank Math and native XML sitemaps while retaining source posts.
function lp_corporate_migrated_url($url) {
    $host = wp_parse_url($url, PHP_URL_HOST);
    if ($host !== wp_parse_url(home_url('/'), PHP_URL_HOST)) return false;
    $path = wp_parse_url($url, PHP_URL_PATH);
    if (!is_string($path)) return false;
    $routes = lp_corporate_migration_routes();
    return isset($routes['/' . trim($path,'/') . '/']);
}
add_filter('rank_math/sitemap/entry', function($entry, $type, $object) {
    if (is_array($entry) && isset($entry['loc']) && lp_corporate_migrated_url($entry['loc'])) return false;
    return $entry;
}, 99, 3);
add_filter('wp_sitemaps_posts_query_args', function($args, $post_type) {
    if (!in_array($post_type,array('post','page'),true)) return $args;
    $excluded = isset($args['post__not_in']) ? (array)$args['post__not_in'] : array();
    foreach (array_keys(lp_corporate_migration_routes()) as $route) {
        $id = url_to_postid(home_url($route));
        if ($id) $excluded[] = $id;
    }
    $args['post__not_in'] = array_values(array_unique($excluded));
    return $args;
}, 99, 2);

// Rebuild sitemap responses instead of serving a pre-migration transient.
add_filter('rank_math/sitemap/enable_caching', '__return_false', 99);

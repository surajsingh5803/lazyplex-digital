<?php
/**
 * Plugin Name: Lazy Plex Main Site SEO Bridge
 * Description: Main WordPress site only: OpenSEO key, AI discovery and Rank Math metadata. No changes to the digital subdomain.
 * Version: 2.0.3
 * Author: Lazy Plex
 * License: GPL-2.0-or-later
 */
if (!defined('ABSPATH')) { exit; }
function lp_main_corporate_llms() { return "# Lazy Plex\n\nLazy Plex is a founder-led business, technology and innovation company with three specialist divisions: Lazy Plex Digital (digital marketing and growth), Lazy Plex Software (business software and automation), and Lazy Plex Labs (mobile games and applications in development).\n\n## Corporate pages\n- https://lazyplex.com/\n- https://lazyplex.com/about/\n- https://lazyplex.com/leadership/\n- https://lazyplex.com/our-approach/\n- https://lazyplex.com/businesses/\n- https://lazyplex.com/software/\n- https://lazyplex.com/labs/\n- https://lazyplex.com/products/\n- https://lazyplex.com/luma-circuit/\n- https://lazyplex.com/insights/\n- https://lazyplex.com/contact/\n- https://lazyplex.com/partnerships/\n- https://lazyplex.com/product-support/\n\n## Lazy Plex Digital\n- https://digital.lazyplex.com/\n- https://digital.lazyplex.com/services/\n- https://digital.lazyplex.com/industries/\n- https://digital.lazyplex.com/pricing/\n- https://digital.lazyplex.com/growth-planner/\n- https://digital.lazyplex.com/insights/\n- https://digital.lazyplex.com/tools/\n\n## Products\n- https://estatecrm.lazyplex.com/ (client-facing product; confirm availability on product site)\n- https://lazyplex.com/luma-circuit/ (in development)\n\nAvailability and claims are limited to verified information.\n"; }
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
        echo lp_main_corporate_llms();
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
    if (!is_file($llms) || @file_get_contents($llms) !== lp_main_corporate_llms()) {
        @file_put_contents($llms, lp_main_corporate_llms(), LOCK_EX);
    }
}
register_activation_hook(__FILE__, 'lp_main_seo_sync_files');
function lp_main_seo_write_docroot() {
    if (wp_parse_url(home_url('/'), PHP_URL_HOST) !== 'lazyplex.com') { return; }
    $root = isset($_SERVER['DOCUMENT_ROOT']) ? rtrim((string) $_SERVER['DOCUMENT_ROOT'], '/\\') . '/' : '';
    if (!$root || !is_dir($root)) { return; }
    $key = '0f54c7b2013f41a8a041d3d62c44ff41';
    $file = $root . $key . '.txt';
    $llms = $root . 'llms.txt';
    if (!is_file($llms) || @file_get_contents($llms) !== lp_main_corporate_llms()) { @file_put_contents($llms, lp_main_corporate_llms(), LOCK_EX); }
    if (!is_file($file) || @file_get_contents($file) !== $key) { @file_put_contents($file, $key, LOCK_EX); }
}
add_action('init', 'lp_main_seo_write_docroot', 2);
add_action('init', function () {
    if (!get_option('lp_main_seo_files_synced_v200')) {
        lp_main_seo_sync_files();
        update_option('lp_main_seo_files_synced_v200', 1, false);
    }
}, 3);

function lp_main_seo_metadata_map() {
    return array(
        407 => array('title'=>'Lazy Plex | Business, Technology & Innovation','description'=>'Find digital marketing, business software and mobile products from Lazy Plex. Choose the right division for your business or product needs.'),
        411 => array('title'=>'About Lazy Plex | Our Company & Businesses','description'=>'Meet the company behind Lazy Plex Digital, Software and Labs. Discover our services, products, purpose and commitment to clear choices.'),
        406 => array('title'=>'Lazy Plex Software | CRM & Business Software','description'=>'Explore LP Real Estate CRM, LP Forms in development and internal software initiatives. Find the right product and support route.'),
        591 => array('title'=>'Lazy Plex Labs | Games & Mobile Apps in Development','description'=>'Discover Luma Circuit, an offline puzzle game in development, and follow upcoming mobile projects from Lazy Plex Labs.'),
        49 => array('title'=>'Business & Technology Insights | Lazy Plex','description'=>'Find practical guides to CRM, sales follow-up, lead qualification, marketing investment and business technology.'),
        157 => array('title'=>'Contact Lazy Plex | Find the Right Team','description'=>'Contact Lazy Plex for digital marketing, software, product support, corporate enquiries or business partnerships.'),
        622 => array('title'=>'Suraj Kumar | Founder of Lazy Plex','description'=>'Meet the founder of Lazy Plex and learn about his focus on digital marketing, business technology and product development.'),
        623 => array('title'=>'Our Approach | How Lazy Plex Works','description'=>'Understand how Lazy Plex helps you choose a service or product, agree scope, review implementation and find support.'),
        624 => array('title'=>'Our Businesses | Lazy Plex Digital, Software & Labs','description'=>'Find the right Lazy Plex division for customer acquisition, business software or upcoming mobile products.'),
        625 => array('title'=>'Products & Digital Tools | Lazy Plex','description'=>'Explore LP Real Estate CRM, Luma Circuit in development, free marketing calculators and our software portfolio.'),
        626 => array('title'=>'Luma Circuit | Offline Puzzle Game in Development','description'=>'Rotate wires and complete circuits. Explore Luma Circuit\'s current development features, 30 puzzles and release status.'),
        627 => array('title'=>'Business & Technology Partnerships | Lazy Plex','description'=>'Discuss business development, technology integrations and specialist delivery opportunities with Lazy Plex.'),
        220 => array('title'=>'My Account | Lazy Plex','description'=>'Manage your Lazy Plex account and existing orders. For product or account assistance, contact the relevant support channel.'),
        218 => array('title'=>'Cart | Lazy Plex','description'=>'Review items in your Lazy Plex cart and confirm your selection before proceeding to checkout.'),
        254 => array('title'=>'Coaching Institute Marketing | Lazy Plex','description'=>'Explore education-focused marketing, student enquiry journeys and website development with Lazy Plex Digital.'),
        628 => array('title'=>'Product Support | Lazy Plex','description'=>'Find product contact routes, issue reporting guidance and privacy resources for LP Real Estate CRM and Luma Circuit.'),
    );
}
function lp_main_blog_metadata_map() {
    return array(
        321 => array('title'=>'How to Choose a Digital Marketing Agency | Lazy Plex','description'=>'A practical buyer checklist for choosing a digital marketing agency: assess strategy, pricing, account ownership, reporting and real business outcomes.'),
        322 => array('title'=>'Why Marketing Leads Do Not Convert | Lazy Plex','description'=>'Diagnose poor lead quality, broken forms, missed calls, slow follow-up and misleading metrics with an actionable service-business conversion guide.'),
        323 => array('title'=>'SEO vs Google Ads vs Meta Ads: Which Works? | Lazy Plex','description'=>'Compare SEO, Google Ads and Meta Ads for service businesses by buyer intent, budget, lead quality, sales cycle and measurement.'),
        325 => array('title'=>'How to Qualify Sales Leads: Scorecards & CRM | Lazy Plex','description'=>'Build a fair, practical lead qualification process using fit criteria, CRM stages, scorecards, handoffs and evidence-based follow-up.'),
        326 => array('title'=>'CRM Automation: A Lead Follow-Up Blueprint | Lazy Plex','description'=>'Learn how to build CRM intake, routing, reminders and follow-up workflows that support customers, sales teams and reliable measurement.'),
        327 => array('title'=>'Marketing ROI: From Leads to Revenue | Lazy Plex','description'=>'Track marketing costs, qualified enquiries, attribution, sales stages and actual revenue without mistaking clicks or forms for customers.'),
        328 => array('title'=>'Healthcare Marketing for Clinics and Hospitals | Lazy Plex','description'=>'A patient-first healthcare marketing strategy covering local search, accurate service pages, appointment enquiries, ethical ads and privacy.'),
        329 => array('title'=>'Real Estate Marketing Strategy for Developers | Lazy Plex','description'=>'Connect developer campaigns, qualified buyers, property enquiry routing, site visits and bookings through measurable real estate growth systems.'),
        330 => array('title'=>'SEO for AI Search in 2026: A Practical Guide | Lazy Plex','description'=>'Improve AI-assisted discovery with useful content, crawlable pages, accurate business information and relevant SEO practices without false promises.'),
        331 => array('title'=>'Digital Marketing Budget for Small Business | Lazy Plex','description'=>'Plan a sustainable marketing budget in India across SEO, paid ads, CRM and website improvements using business economics and realistic tests.')
    );
}
add_filter('rank_math/frontend/title', function($title) {
    if (is_singular('post')) { $postMap = lp_main_blog_metadata_map(); $postId = get_queried_object_id(); return isset($postMap[$postId]) ? $postMap[$postId]['title'] : $title; }
    if (!is_page()) return $title;
    $map = lp_main_seo_metadata_map(); $id = get_queried_object_id();
    return isset($map[$id]) ? $map[$id]['title'] : $title;
}, 99);
add_filter('rank_math/frontend/description', function($description) {
    if (is_category('uncategorized')) return 'Browse business and technology perspectives from Lazy Plex.';
    if (function_exists('is_shop') && is_shop()) return 'For product availability, account enquiries and support, contact Lazy Plex through the appropriate product or corporate channel.';
    if (is_singular('post')) { $postMap = lp_main_blog_metadata_map(); $postId = get_queried_object_id(); return isset($postMap[$postId]) ? $postMap[$postId]['description'] : $description; }
    if (!is_page()) return $description;
    $map = lp_main_seo_metadata_map(); $id = get_queried_object_id();
    return isset($map[$id]) ? $map[$id]['description'] : $description;
}, 99);
add_filter('rank_math/frontend/robots', function($robots) {
    if (is_page(array(217,218,219,220)) || is_post_type_archive('product') || is_category() || is_singular('product')) {
        $robots['index'] = 'noindex'; $robots['follow'] = 'follow';
    }
    return $robots;
}, 99);
add_action('template_redirect', function() {
    $path = wp_parse_url(isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '/', PHP_URL_PATH);
    $redirects = array('/elementor-287/' => '/businesses/', '/hello-world/' => '/insights/', '/digital-bundle/' => '/businesses/', '/digital-bundle-thank-you/' => '/businesses/', '/product/222/' => '/businesses/');
    if (isset($redirects[$path])) { wp_safe_redirect(home_url($redirects[$path]), 301); exit; }
}, 1);

// Keep corporate organisation identity consistent without replacing other schema nodes.
add_filter('rank_math/json_ld', function($data) {
    if (!is_array($data)) return $data;
    foreach ($data as &$node) {
        if (!is_array($node)) continue;
        $types = isset($node['@type']) ? (array) $node['@type'] : array();
        if (in_array('Organization', $types, true) && isset($node['name']) && $node['name'] === 'Lazy Plex') {
            $node['description'] = 'Founder-led business, technology and innovation company with Digital, Software and Labs divisions.';
            $node['url'] = home_url('/');
            $node['subOrganization'] = array(array('@type'=>'Organization','name'=>'Lazy Plex Digital','url'=>'https://digital.lazyplex.com/'),array('@type'=>'Organization','name'=>'Lazy Plex Software','url'=>home_url('/software/')),array('@type'=>'Organization','name'=>'Lazy Plex Labs','url'=>home_url('/labs/')));
        }
    }
    unset($node);
    return $data;
}, 99);

// Conservative frontend protection; leave admin, REST, checkout/payment integrations and embeds unchanged.
add_action('send_headers', function() {
    if (is_admin() || wp_doing_ajax() || (defined('REST_REQUEST') && REST_REQUEST) || headers_sent()) return;
    if (function_exists('is_checkout') && is_checkout()) return;
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    if (is_page(array(407,411,406,591,49,157,622,623,624,625,626,627,628))) {
        header('X-Frame-Options: SAMEORIGIN');
        header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
    }
}, 99);

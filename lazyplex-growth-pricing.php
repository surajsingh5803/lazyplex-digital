<?php
/**
 * Plugin Name: Lazy Plex Growth Pricing
 * Description: Server-calculated, editable tiered service pricing and four-pillar solution builder for Lazy Plex.
 * Version: 1.0.1
 * Author: Lazy Plex
 * License: GPL-2.0-or-later
 */
if (!defined('ABSPATH')) exit;
const LPGP_VERSION = '1.0.1';
const LPGP_OPTION = 'lpgp_configuration_v1';
// One-time publication approval. Never re-enable a catalogue after an admin later unpublishes it.
add_action('init',function(){
 if(get_option('lpgp_2026_launch_approved','')==='yes')return;
 $saved=get_option(LPGP_OPTION,[]);if(!is_array($saved))$saved=[];
 update_option('lpgp_previous_configuration',$saved,false);
 $saved['pricing_published']=true;
 $saved['updated_at']=current_time('mysql');
 update_option(LPGP_OPTION,$saved,false);
 update_option('lpgp_2026_launch_approved','yes',false);
},5);


function lpgp_tiers() { return ['basic'=>'Basic', 'intermediate'=>'Intermediate', 'advanced'=>'Advanced']; }
function lpgp_pillars() { return [
 'get'=>['title'=>'Get Customers','description'=>'Attract relevant demand through connected acquisition capabilities.','service_ids'=>['seo','local','ai_search','google','meta','social','branding','content']],
 'convert'=>['title'=>'Convert Customers','description'=>'Improve qualification, conversion journeys and useful sales enquiries.','service_ids'=>['lead_gen','cro','website']],
 'automate'=>['title'=>'Automate Operations','description'=>'Connect pipelines, approved messages and helpful automation.','service_ids'=>['crm','ai_auto','messaging']],
 'measure'=>['title'=>'Measure Growth','description'=>'Track attributed enquiries, real opportunities and performance.','service_ids'=>['analytics']],
]; }
function lpgp_service($id,$title,$pillar,$unit,$rates,$scopes,$link,$summary) {
 $tiers=[];
 foreach(lpgp_tiers() as $key=>$label){
  $v=$rates[$key];$tiers[$key]=['monthly'=>($unit==='monthly'?intval($v):0),'once'=>($unit==='once'?intval($v):0),'scope'=>sanitize_text_field($scopes[$key])];
 }
 return ['id'=>$id,'name'=>$title,'pillar'=>$pillar,'unit'=>$unit,'summary'=>$summary,'url'=>'https://digital.lazyplex.com/services/'.$link.'/','tiers'=>$tiers];
}
function lpgp_default_services(){
 $services=[
 'seo'=>lpgp_service('seo','SEO','get','monthly',['basic'=>19999,'intermediate'=>34999,'advanced'=>59999],['basic'=>'Up to 5 existing pages/month; audit, keyword mapping, internal links and GSC review','intermediate'=>'Up to 12 existing pages/month, deeper technical reviews and 2 optimisation check-ins','advanced'=>'Up to 25 existing pages/month, advanced technical improvements and weekly reviews'],'search-engine-optimisation','Technical and on-page search optimisation'),
 'local'=>lpgp_service('local','Local SEO & GBP','get','monthly',['basic'=>7999,'intermediate'=>14999,'advanced'=>24999],['basic'=>'1 eligible location, profile review, up to 4 updates and basic reporting','intermediate'=>'Up to 2 eligible locations and expanded local landing page work','advanced'=>'Up to 3 eligible locations, regular local content and detailed reporting'],'local-seo','Local search and Google Business Profile management; prices per location need tailored multi-location scope'),
 'ai_search'=>lpgp_service('ai_search','AI Search Optimisation','get','monthly',['basic'=>14999,'intermediate'=>27999,'advanced'=>44999],['basic'=>'Baseline AI visibility review and 2 relevant page recommendations','intermediate'=>'15 buyer-question observations and up to 2 page improvements','advanced'=>'30 observations, up to 4 improvements and technical entity review'],'ai-search-optimisation','Improve answer-readiness through accurate content and technical SEO; no citation guarantees'),
 'google'=>lpgp_service('google','Google Ads Management','get','monthly',['basic'=>12999,'intermediate'=>24999,'advanced'=>44999],['basic'=>'1 account, up to 2 campaigns, conversion review and monthly optimisation','intermediate'=>'Up to 5 campaigns, ongoing optimisation and 2 reviews','advanced'=>'Up to 10 campaigns, more segments and weekly reviews'],'google-ads-ppc','Management only; advertising budget is additional'),
 'meta'=>lpgp_service('meta','Meta Ads Management','get','monthly',['basic'=>12999,'intermediate'=>24999,'advanced'=>44999],['basic'=>'1 account, up to 2 campaigns and 4 static creatives/month','intermediate'=>'Up to 5 campaigns, 8 static creatives/month and 2 reviews','advanced'=>'Up to 10 campaigns, 14 static creatives/month and weekly reviews'],'meta-ads','Management and capped creative work; advertising budget is additional'),
 'social'=>lpgp_service('social','Social Media Marketing','get','monthly',['basic'=>14999,'intermediate'=>27999,'advanced'=>49999],['basic'=>'Up to 2 platforms, 10 posts/month and 2 edits from client footage','intermediate'=>'Up to 3 platforms, 16 posts and 4 edited short videos','advanced'=>'Up to 3 platforms, 24 posts and 8 edited short videos'],'social-media-marketing','Design, captions and scheduled content within agreed channels'),
 'branding'=>lpgp_service('branding','Branding & Design','get','once',['basic'=>29999,'intermediate'=>59999,'advanced'=>119999],['basic'=>'Essential brand identity and reusable starter templates, 2 revision rounds','intermediate'=>'Expanded visual identity, templates and practical brand guide','advanced'=>'Strategy-led visual identity and extended brand system'],'branding-design','One-time branding project; distinct from minor template alignment in bundles'),
 'content'=>lpgp_service('content','Content Marketing','get','monthly',['basic'=>19999,'intermediate'=>34999,'advanced'=>59999],['basic'=>'3 researched articles/month, editorial review, metadata and internal links','intermediate'=>'6 articles/month, topical plans and internal link optimisation','advanced'=>'10 articles/month, more detailed content programme and review'],'content-marketing','Article content production and optimisation; additional formats scoped separately'),
 'lead_gen'=>lpgp_service('lead_gen','Lead Generation & Funnel Management','convert','monthly',['basic'=>12999,'intermediate'=>24999,'advanced'=>44999],['basic'=>'One lead funnel monitored and monthly lead-quality review; setup is extra','intermediate'=>'Two funnels, qualification rules and twice-monthly review; setup extra','advanced'=>'Multi-funnel optimisation and deeper sales handoff review; setup extra'],'lead-generation','Monthly funnel work; one-time setup priced separately'),
 'cro'=>lpgp_service('cro','Conversion Rate Optimisation','convert','monthly',['basic'=>14999,'intermediate'=>29999,'advanced'=>54999],['basic'=>'One customer journey audited, fixes prioritised and one monthly review','intermediate'=>'Two journeys, experiment backlog and twice-monthly review','advanced'=>'Multi-journey optimisation and weekly experiment review'],'conversion-optimisation','Improve conversion actions without promising sales'),
 'website'=>lpgp_service('website','Website Development','convert','once',['basic'=>34999,'intermediate'=>74999,'advanced'=>149999],['basic'=>'Up to 5-page responsive business website, essential forms and technical SEO basics','intermediate'=>'Up to 12 pages, stronger custom layouts and integrations','advanced'=>'Custom multi-template build, up to 25 pages and defined integrations'],'website-development','One-time website project; hosting, domain and support are separate'),
 'crm'=>lpgp_service('crm','CRM Setup & Automation','automate','once',['basic'=>24999,'intermediate'=>59999,'advanced'=>124999],['basic'=>'One pipeline, fields, up to 2 lead sources and 2 workflows','intermediate'=>'Multiple pipelines, up to 4 sources and 5 workflows','advanced'=>'Multi-team implementation and up to 10 workflows with complex role mapping'],'crm-automation','CRM implementation; recurring licences and support separate'),
 'ai_auto'=>lpgp_service('ai_auto','AI Chatbot & Automation','automate','once',['basic'=>29999,'intermediate'=>74999,'advanced'=>149999],['basic'=>'One FAQ and enquiry assistant with handoff, testing and review','intermediate'=>'Two workflows, basic integrations and review','advanced'=>'Advanced scoped workflows and integrations with safety controls'],'ai-automation','One-time automation setup; usage and support charges separate'),
 'messaging'=>lpgp_service('messaging','Email & WhatsApp Marketing','automate','monthly',['basic'=>12999,'intermediate'=>24999,'advanced'=>44999],['basic'=>'Up to 4 campaign sends/month using approved lists and 2 templates','intermediate'=>'Up to 8 sends, segmentation and reporting','advanced'=>'Up to 16 sends, journey planning and deeper analysis'],'email-whatsapp-marketing','Consent-based campaigns; provider and messaging fees extra'),
 'analytics'=>lpgp_service('analytics','Analytics & Performance Reporting','measure','monthly',['basic'=>9999,'intermediate'=>19999,'advanced'=>39999],['basic'=>'Monthly performance scorecard and data checks; separate setup','intermediate'=>'Cross-channel dashboard, 2 monthly reviews; separate setup','advanced'=>'Multi-source dashboard, deeper reporting and weekly reviews; setup extra'],'analytics-reporting','Ongoing measurement; one-time initial configuration is quoted separately'),
 ];
 foreach(['basic'=>19999,'intermediate'=>39999,'advanced'=>79999] as $t=>$once)$services['lead_gen']['tiers'][$t]['once']=$once;
 foreach(['basic'=>14999,'intermediate'=>34999,'advanced'=>69999] as $t=>$once)$services['analytics']['tiers'][$t]['once']=$once;
 return $services;
}
function lpgp_bundle_defaults(){
 $get_scopes=[
  'basic'=>['SEO: up to 3 existing pages','Local SEO: 1 location, 2 updates','AI search: baseline review','Google Ads: 1 campaign','Meta Ads: 1 campaign','Social: 6 posts','Branding: template alignment (not logo redesign)','Content: 1 researched article','Monthly acquisition report'],
  'intermediate'=>['SEO: up to 8 existing pages','Local SEO: 1 location, 4 updates','AI search: 15 question checks','Google Ads: up to 2 campaigns','Meta Ads: up to 2 campaigns','Social: 10 posts and 2 edits','Branding: 5 reusable templates','Content: 2 researched articles','Twice-monthly reviews'],
  'advanced'=>['SEO: up to 15 existing pages','Local SEO: up to 2 locations','AI search: 30 question checks','Google Ads: up to 4 campaigns','Meta Ads: up to 4 campaigns','Social: 16 posts and 4 edits','Branding: expanded reusable templates','Content: 4 researched articles','Weekly reviews'],
 ];
 $bundles=[
  'get'=>['title'=>'Get Customers','tiers'=>[
   'basic'=>['monthly'=>49999,'once'=>0,'scopes'=>$get_scopes['basic']],
   'intermediate'=>['monthly'=>89999,'once'=>0,'scopes'=>$get_scopes['intermediate']],
   'advanced'=>['monthly'=>149999,'once'=>0,'scopes'=>$get_scopes['advanced']]],
   'included'=>lpgp_pillars()['get']['service_ids'],'verified_reference'=>false,'reference_monthly'=>0,'reference_once'=>0],
  'convert'=>['title'=>'Convert Customers','tiers'=>['basic'=>['monthly'=>null,'once'=>null,'scopes'=>['Quote after confirming landing pages, lead qualification and conversion scope']], 'intermediate'=>['monthly'=>null,'once'=>null,'scopes'=>['Conversion programme scoped to the customer journey']], 'advanced'=>['monthly'=>null,'once'=>null,'scopes'=>['Custom conversion programme']]],'included'=>lpgp_pillars()['convert']['service_ids'],'verified_reference'=>false,'reference_monthly'=>0,'reference_once'=>0],
  'automate'=>['title'=>'Automate Operations','tiers'=>['basic'=>['monthly'=>null,'once'=>null,'scopes'=>['CRM, automation and messaging scope confirmed in discovery']], 'intermediate'=>['monthly'=>null,'once'=>null,'scopes'=>['Workflow and integration programme scoped by system']], 'advanced'=>['monthly'=>null,'once'=>null,'scopes'=>['Custom multi-team automation programme']]],'included'=>lpgp_pillars()['automate']['service_ids'],'verified_reference'=>false,'reference_monthly'=>0,'reference_once'=>0],
  'measure'=>['title'=>'Measure Growth','tiers'=>['basic'=>['monthly'=>null,'once'=>null,'scopes'=>['Baseline analytics and reporting requirements']], 'intermediate'=>['monthly'=>null,'once'=>null,'scopes'=>['Cross-channel reporting and analysis requirements']], 'advanced'=>['monthly'=>null,'once'=>null,'scopes'=>['Custom attribution and reporting programme']]],'included'=>lpgp_pillars()['measure']['service_ids'],'verified_reference'=>false,'reference_monthly'=>0,'reference_once'=>0]
 ];
 foreach($bundles as $id=>$b)foreach(lpgp_tiers() as $tier=>$label)$bundles[$id]['benchmarks'][$tier]=['verified'=>false,'monthly'=>0,'once'=>0];
 return $bundles;
}
function lpgp_config(){
 $config=['services'=>lpgp_default_services(),'bundles'=>lpgp_bundle_defaults(),'pricing_published'=>false,'updated_at'=>'2026-11-22'];
 $saved=get_option(LPGP_OPTION,[]);
 if(!is_array($saved)) return $config;
 if(isset($saved['services'])&&is_array($saved['services'])) foreach($config['services'] as $id=>$service){
  foreach(lpgp_tiers() as $tier=>$label) foreach(['monthly','once'] as $field){
   if(isset($saved['services'][$id]['tiers'][$tier][$field]))$config['services'][$id]['tiers'][$tier][$field]=max(0,intval($saved['services'][$id]['tiers'][$tier][$field]));
  }
  foreach(lpgp_tiers() as $tier=>$label)if(isset($saved['services'][$id]['tiers'][$tier]['scope']))$config['services'][$id]['tiers'][$tier]['scope']=sanitize_textarea_field($saved['services'][$id]['tiers'][$tier]['scope']);
 }
 if(isset($saved['bundles'])&&is_array($saved['bundles'])) foreach($config['bundles'] as $id=>$bundle){
  foreach(lpgp_tiers() as $tier=>$label) foreach(['monthly','once'] as $field){
   if(isset($saved['bundles'][$id]['tiers'][$tier][$field])){
    $value=$saved['bundles'][$id]['tiers'][$tier][$field];$config['bundles'][$id]['tiers'][$tier][$field]=($value===''||$value===null)?null:max(0,intval($value));
   }
  }
  foreach(lpgp_tiers() as $tier=>$label){
   if(isset($saved['bundles'][$id]['tiers'][$tier]['scopes'])&&is_array($saved['bundles'][$id]['tiers'][$tier]['scopes'])){
    $scopes=[];foreach(array_slice($saved['bundles'][$id]['tiers'][$tier]['scopes'],0,25) as $item){$clean=trim(sanitize_text_field($item));if($clean!=='')$scopes[]=$clean;}
    if($scopes)$config['bundles'][$id]['tiers'][$tier]['scopes']=$scopes;
   }
   if(isset($saved['bundles'][$id]['benchmarks'][$tier]['verified']))$config['bundles'][$id]['benchmarks'][$tier]['verified']=in_array($saved['bundles'][$id]['benchmarks'][$tier]['verified'],['1',1,true],true);
   foreach(['monthly','once'] as $field)if(isset($saved['bundles'][$id]['benchmarks'][$tier][$field]))$config['bundles'][$id]['benchmarks'][$tier][$field]=max(0,intval($saved['bundles'][$id]['benchmarks'][$tier][$field]));
  }
 }
 $config['pricing_published']=!empty($saved['pricing_published']);
 $config['updated_at']=isset($saved['updated_at'])?sanitize_text_field($saved['updated_at']):$config['updated_at'];
 return $config;
}
function lpgp_public_catalog(){
 $c=lpgp_config();return ['version'=>LPGP_VERSION,'status'=>$c['pricing_published']?'published':'planning-preview','currency'=>'INR','pricing_note'=>$c['pricing_published']?'Published starting prices. Confirm scope, deliverables, taxes and external charges before a binding quotation.':'Working prices only — not approved, not a purchase offer. No payments are accepted.','tiers'=>lpgp_tiers(),'pillars'=>lpgp_pillars(),'services'=>array_values($c['services']),'bundles'=>$c['bundles'],'external_costs'=>'GST, advertising budgets, domain/hosting, API subscriptions, software and messaging fees are additional where applicable.'];
}
function lpgp_quote($input){
 $c=lpgp_config();$mode=isset($input['mode'])?sanitize_key($input['mode']):'individual';$tier=isset($input['tier'])?sanitize_key($input['tier']):'basic';if(!array_key_exists($tier,lpgp_tiers()))return new WP_Error('invalid_tier','Invalid tier',['status'=>400]);
 $out=['mode'=>$mode,'tier'=>$tier,'currency'=>'INR','public_pricing'=>$c['pricing_published'],'monthly'=>0,'once'=>0,'lines'=>[],'savings'=>null,'reference'=>null,'comparison_note'=>''];
 if($mode==='individual'){
  $choices=$input['selected']??[];if(!is_array($choices)||count($choices)>15)return new WP_Error('invalid_selection','Select at most 15 services',['status'=>400]);
  $done=[];
  foreach($choices as $choice){$id=is_array($choice)?sanitize_key($choice['id']??''):'';$t=is_array($choice)?sanitize_key($choice['tier']??'basic'):'';
   if(!isset($c['services'][$id])||!array_key_exists($t,lpgp_tiers())||isset($done[$id]))return new WP_Error('invalid_service','Invalid or duplicate selected service',['status'=>400]);
   $done[$id]=true;$s=$c['services'][$id];$price=$s['tiers'][$t];$out['monthly']+=$price['monthly'];$out['once']+=$price['once'];
   $out['lines'][]=['id'=>$id,'name'=>$s['name'],'tier'=>$t,'monthly'=>$price['monthly'],'once'=>$price['once'],'scope'=>$price['scope'],'pillar'=>$s['pillar']];
  }
  $out['comparison_note']='A standalone selection may have different deliverable quantities from the pillar bundle. Do not infer savings from headline prices alone.';
 }elseif($mode==='bundle'){
  $pillar=isset($input['pillar'])?sanitize_key($input['pillar']):'get';if(!isset($c['bundles'][$pillar]))return new WP_Error('invalid_pillar','Invalid pillar',['status'=>400]);
  $bundle=$c['bundles'][$pillar];$p=$bundle['tiers'][$tier];$out['pillar']=$pillar;$out['title']=$bundle['title'];$out['included_services']=$bundle['included'];$out['scopes']=$p['scopes'];$out['monthly']=$p['monthly'];$out['once']=$p['once'];
  $out['comparison_note']='This bundle contains limited shared-scope deliverables, not the complete standalone Basic service scope for every category.';
  $extras=$input['selected']??[];
  if(!is_array($extras)||count($extras)>15)return new WP_Error('invalid_extras','Too many add-on selections',['status'=>400]);
  $seen=[];$out['extras']=[];
  foreach($extras as $extra){
   $id=is_array($extra)?sanitize_key($extra['id']??''):'';$t=is_array($extra)?sanitize_key($extra['tier']??'basic'):'';
   if(!isset($c['services'][$id])||!array_key_exists($t,lpgp_tiers())||isset($seen[$id]))return new WP_Error('invalid_extra','Invalid or duplicate add-on',['status'=>400]);
   $seen[$id]=true;
   if(in_array($id,$bundle['included'],true))continue; // Already included: never double-charge.
   $extra_service=$c['services'][$id];$price=$extra_service['tiers'][$t];
   $out['extras'][]=['id'=>$id,'name'=>$extra_service['name'],'tier'=>$t,'monthly'=>$price['monthly'],'once'=>$price['once']];
   if($out['monthly']!==null)$out['monthly']+=$price['monthly'];
   if($out['once']!==null)$out['once']+=$price['once'];
  }
  $ref=$bundle['benchmarks'][$tier];
  if($ref['verified'] && $c['pricing_published'] && $p['monthly']!==null && $ref['monthly']>$p['monthly'] && $p['once']!==null && $ref['once'] >= $p['once']){
   $out['reference']=['monthly'=>$ref['monthly'],'once'=>$ref['once']];
   $out['savings']=['monthly'=>$ref['monthly']-$p['monthly'],'once'=>max(0,$ref['once']-$p['once'])];
   $out['comparison_note']='Equivalent-deliverable standalone reference for this exact tier was verified by pricing administration; savings exclude separately selected extras.';
  }
 }else{return new WP_Error('invalid_mode','Invalid pricing mode',['status'=>400]);}
 $out['first_month']=($out['monthly']===null||$out['once']===null)?null:($out['monthly']+$out['once']);
 $out['quote_status']=$c['pricing_published']?'starting-estimate':'planning-preview';
 return $out;
}
add_action('rest_api_init',function(){
 register_rest_route('lp-growth-pricing/v1','/catalog',['methods'=>'GET','callback'=>function(){return rest_ensure_response(lpgp_public_catalog());},'permission_callback'=>'__return_true']);
 register_rest_route('lp-growth-pricing/v1','/calculate',['methods'=>'POST','callback'=>function($request){$json=$request->get_json_params();if(!is_array($json))return new WP_Error('invalid_body','Expected JSON object',['status'=>400]);return rest_ensure_response(lpgp_quote($json));},'permission_callback'=>'__return_true']);
});

/** A private, non-public quote enquiry record. Never expose contact details in GA or public REST responses. */
add_action('init',function(){
 register_post_type('lpgp_enquiry',['label'=>'Growth Quote Enquiries','public'=>false,'publicly_queryable'=>false,'show_ui'=>true,'show_in_menu'=>'lpgp-settings','supports'=>['title','editor'],'capability_type'=>'post','map_meta_cap'=>true,'exclude_from_search'=>true]);
},20);
function lpgp_handle_quote_request($request){
 $body=$request->get_json_params();
 if(!is_array($body))return new WP_Error('invalid_request','Invalid request body',['status'=>400]);
 if(!empty($body['website_field']))return rest_ensure_response(['received'=>true,'message'=>'Thank you.']); // Honeypot.
 if(empty($body['consent']))return new WP_Error('consent_required','Please agree to be contacted about this quotation',['status'=>400]);
 $name=trim(sanitize_text_field($body['name']??''));$company=trim(sanitize_text_field($body['company']??''));
 $email=sanitize_email($body['email']??'');$phone=trim(sanitize_text_field($body['phone']??''));
 $detail=trim(sanitize_textarea_field($body['message']??''));
 if(strlen($name)<2||strlen($name)>100||strlen($company)>130||!is_email($email)||strlen($phone)>40||strlen($detail)>2000)return new WP_Error('invalid_contact','Please enter a valid name and email, and check field lengths',['status'=>400]);
 $ip=isset($_SERVER['REMOTE_ADDR'])?sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])):'';
 $token='lpgp_rate_'.hash_hmac('sha256',$ip,wp_salt('nonce'));
 $used=(int)get_transient($token);if($used>=5)return new WP_Error('too_many_requests','Too many requests. Please try again later or contact us directly.',['status'=>429]);
 set_transient($token,$used+1,HOUR_IN_SECONDS);
 $selection=$body['selection']??[];if(!is_array($selection))return new WP_Error('invalid_selection','Select services or a growth pillar',['status'=>400]);
 $quote=lpgp_quote($selection);if(is_wp_error($quote))return $quote;
 if($quote['mode']==='individual'&&empty($quote['lines']))return new WP_Error('empty_selection','Please choose at least one service',['status'=>400]);
 $enquiry_id=wp_insert_post(['post_type'=>'lpgp_enquiry','post_status'=>'private','post_title'=>'Growth quotation - '.$name.' - '.gmdate('Y-m-d H:i'),'post_content'=>wp_json_encode(['name'=>$name,'company'=>$company,'email'=>$email,'phone'=>$phone,'message'=>$detail,'selection'=>$selection,'server_quote'=>$quote],JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE)],true);
 if(is_wp_error($enquiry_id))return new WP_Error('save_failed','Unable to confirm your request. Please use our contact page.',['status'=>500]);
 $reference='LPQ-'.str_pad((string)$enquiry_id,6,'0',STR_PAD_LEFT);
 update_post_meta($enquiry_id,'lpgp_reference',$reference);
 update_post_meta($enquiry_id,'lpgp_submitted_utc',gmdate('c'));
 $subject='New Lazy Plex growth quote request '.$reference;
 $details="New website pricing enquiry\nReference: $reference\nName: $name\nCompany: $company\nEmail: $email\nPhone: $phone\nMonthly: ".($quote['monthly']===null?'Custom':$quote['monthly'])." INR\nOne-time: ".($quote['once']===null?'Custom':$quote['once'])." INR\nNotes: $detail\nWP Admin: ".admin_url('post.php?post='.$enquiry_id.'&action=edit');
 wp_mail(get_option('admin_email'),$subject,$details,['Reply-To: '.$email]);
 return rest_ensure_response(['received'=>true,'reference'=>$reference,'message'=>'Your quotation request has been saved. Our team can now review the selected services and scope.']);
}
add_action('rest_api_init',function(){register_rest_route('lp-growth-pricing/v1','/request-quote',['methods'=>'POST','callback'=>'lpgp_handle_quote_request','permission_callback'=>'__return_true']);});

add_action('wp_enqueue_scripts',function(){
 if(!is_page(['pricing-preview','pricing','services']))return;
 wp_enqueue_style('lpgp-front',plugins_url('assets/pricing.css',__FILE__),[],LPGP_VERSION);
 wp_enqueue_script('lpgp-front',plugins_url('assets/pricing.js',__FILE__),[],LPGP_VERSION,true);
 wp_add_inline_script('lpgp-front','window.LPGP_CONFIG='.wp_json_encode(['catalog'=>esc_url_raw(rest_url('lp-growth-pricing/v1/catalog')),'calculate'=>esc_url_raw(rest_url('lp-growth-pricing/v1/calculate')),'request'=>esc_url_raw(rest_url('lp-growth-pricing/v1/request-quote')),'privacy'=>esc_url_raw(home_url('/privacy-policy/')),'contact'=>home_url('/contact/'),'audit'=>home_url('/growth-audit/')]).';','before');
});
add_shortcode('lp_growth_pricing',function(){
 ob_start();?>
 <div id="lpgp-pricing" class="lpgp-root" data-lpgp-app="1">
 <script type="application/json" data-lpgp-catalog><?php echo wp_json_encode(lpgp_public_catalog(), JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT); ?></script>
 <section class="lpgp-hero"><div class="lpgp-kicker">LAZY PLEX · GROWTH SOLUTION BUILDER</div><h1><?php echo is_page('pricing')?'Growth packages and transparent service pricing.':'Four growth pillars. Your perfect mix.'; ?></h1><p>Choose a complete growth pillar or build a custom selection of specialist services. Compare capped deliverables, recurring fees and one-time project costs without paying twice for included services.</p><?php if(is_page('pricing-preview')): ?><p class="lpgp-warning">Review preview · Public prices are starting prices, with fixed deliverable limits. This page is excluded from indexing.</p><?php else: ?><p class="lpgp-warning">Published starting prices. Every bundle has defined limits; ad spend, taxes, licences and additional setup are separate.</p><?php endif; ?></section>
 <div class="lpgp-shell"><div class="lpgp-placeholder" role="status">Loading the service catalogue and pricing calculator…</div></div>
 <section class="lpgp-seo-content"><div class="lpgp-seo-wrap"><div class="lpgp-kicker">A TRANSPARENT SERVICE CATALOGUE</div><h2>All specialist services and proposed starting prices</h2><p>These are illustrative individual service prices for comparing options. Each growth solution is a separately scoped bundle. Buying a bundle does not mean receiving the entire standalone deliverable list for every capability.</p>
 <?php $catalog=lpgp_public_catalog(); foreach($catalog['pillars'] as $pid=>$pillar): ?>
 <h3><?php echo esc_html($pillar['title']); ?></h3><div class="lpgp-table-scroll"><table><thead><tr><th scope="col">Individual service</th><th scope="col">Basic</th><th scope="col">Intermediate</th><th scope="col">Advanced</th></tr></thead><tbody>
 <?php foreach($catalog['services'] as $service):if($service['pillar']!==$pid)continue;?><tr><th scope="row"><a href="<?php echo esc_url($service['url']); ?>"><?php echo esc_html($service['name']); ?></a></th><?php foreach(lpgp_tiers() as $tier=>$label){$pr=$service['tiers'][$tier];echo '<td>'.esc_html('₹'.number_format_i18n($pr['monthly']?:$pr['once'])).($service['unit']==='once'?'/project':'/month');if($pr['once']&&$pr['monthly'])echo ' <small>+₹'.esc_html(number_format_i18n($pr['once'])).' setup</small>';echo '</td>';}?></tr><?php endforeach;?></tbody></table></div>
 <?php endforeach;?><p><strong>Budget clarity:</strong> media spend, taxes, custom development, domains, hosting and provider usage costs are separate. See full scope and exclusions before approving a quotation.</p></div></section>
 <noscript><section class="lpgp-static"><h2>Get Customers · Connected acquisition</h2><p>Includes capped SEO, Local SEO, AI search, Google Ads, Meta Ads, social, brand alignment and content work in every tier.</p><p>Get Customers starting packages: Basic ₹49,999/month; Intermediate ₹89,999/month; Advanced ₹1,49,999/month. GST and external costs extra.</p><h2>Other pillars</h2><p>Convert Customers, Automate Operations and Measure Growth are quoted after requirements and delivery scope are confirmed.</p><p><a href="/contact/">Request a consultation</a></p></section></noscript>
 </div>
 <?php return ob_get_clean();
});
/** SEO-crawlable, server-maintained service directory using the same rates as the quote calculator. */
add_shortcode('lp_growth_services',function(){
 $catalog=lpgp_public_catalog();ob_start(); ?>
 <div class="lpgp-root lpgp-directory">
 <section class="lpgp-hero"><div class="lpgp-kicker">LAZY PLEX · INDIVIDUAL SPECIALIST SERVICES</div><h1>Choose the right service.<br>Know exactly what you're buying.</h1><p>Browse fifteen digital and operational services grouped under Get Customers, Convert Customers, Automate Operations and Measure Growth. Select Basic, Intermediate or Advanced on the pricing builder. All starting fees, deliverables and one-time charges come from one maintained catalogue.</p><div class="lpgp-directory-actions"><a class="lpgp-submit" href="<?php echo esc_url(home_url('/pricing/?mode=individual')); ?>">Open interactive service selector ↗</a><a class="lpgp-ghost-btn" href="<?php echo esc_url(home_url('/solutions/')); ?>">Explore complete growth solutions ↗</a></div></section>
 <div class="lpgp-directory-body">
 <section><div class="lpgp-kicker">TWO WAYS TO BUY</div><h2>A standalone service or one complete pillar solution</h2><p>A standalone engagement gives dedicated capacity for one chosen service. A pillar bundle includes all of that pillar's listed capabilities at smaller, shared limits. Get Customers contains eight acquisition capabilities in Basic, Intermediate and Advanced packages. Compare actual quantities, not just headline fees.</p></section>
 <?php foreach($catalog['pillars'] as $pillar_id=>$pillar): ?>
 <section class="lpgp-directory-pillar"><div class="lpgp-kicker">GROWTH PILLAR</div><h2><?php echo esc_html($pillar['title']); ?></h2><p><?php echo esc_html($pillar['description']); ?></p><div class="lpgp-directory-grid">
 <?php foreach($catalog['services'] as $service):if($service['pillar']!==$pillar_id)continue; ?>
 <article class="lpgp-directory-card"><h3><?php echo esc_html($service['name']); ?></h3><p><?php echo esc_html($service['summary']); ?></p><div class="lpgp-rate-grid">
 <?php foreach(lpgp_tiers() as $key=>$name):$s=$service['tiers'][$key];?><div><span><?php echo esc_html($name); ?></span><strong><?php echo esc_html('₹'.number_format_i18n($s['monthly']?:$s['once'])); ?></strong><small><?php echo $service['unit']==='once'?'one-time':'/month'; ?></small><?php if($s['monthly']&&$s['once']):?><small>+ ₹<?php echo esc_html(number_format_i18n($s['once'])); ?> setup</small><?php endif; ?></div><?php endforeach; ?></div>
 <details><summary>What's included at each level?</summary><?php foreach(lpgp_tiers() as $key=>$name):?><p><strong><?php echo esc_html($name); ?>:</strong> <?php echo esc_html($service['tiers'][$key]['scope']); ?></p><?php endforeach; ?></details><div class="lpgp-directory-links"><a href="<?php echo esc_url(home_url('/pricing/?mode=individual&pillar='.$pillar_id.'&service='.$service['id'])); ?>">Select <?php echo esc_html($service['name']); ?> ↗</a><a href="<?php echo esc_url($service['url']); ?>">Detailed Digital service guide ↗</a></div></article>
 <?php endforeach; ?></div><p><a href="<?php echo esc_url(home_url('/pricing/?mode=bundle&pillar='.$pillar_id)); ?>">Compare the complete <?php echo esc_html($pillar['title']); ?> bundle with individual services ↗</a></p></section>
 <?php endforeach; ?>
 <section class="lpgp-directory-end"><h2>Explore packages across all nine industries.</h2><p>Whether your goal is a qualified property enquiry, a patient appointment, an eligible application, a purchase, a booking or a technically suitable RFQ, we tailor the engagement to that outcome. Media spend, taxes, third-party platforms and custom implementation are additional where applicable.</p><a href="<?php echo esc_url(home_url('/industries/')); ?>">Explore nine industry growth systems ↗</a> · <a href="<?php echo esc_url(home_url('/growth-audit/')); ?>">Request a growth audit ↗</a></section>
 </div></div>
 <?php return ob_get_clean();
});

add_filter('hello_elementor_page_title',function($show){return is_page(['pricing-preview','pricing','services'])?false:$show;},99);
add_filter('wp_robots',function($robots){if(is_page('pricing-preview')){$robots['noindex']=true;$robots['nofollow']=true;}return $robots;});
add_action('wp_head',function(){if(is_page('pricing-preview'))echo '<meta name="robots" content="noindex,nofollow" />' . "\n";},1);

add_action('admin_menu',function(){add_menu_page('Lazy Plex Pricing','LP Pricing','manage_options','lpgp-settings','lpgp_admin_screen','dashicons-chart-line',59);});
function lpgp_admin_screen(){if(!current_user_can('manage_options'))wp_die('Not authorised');
 if(isset($_POST['lpgp_save'])){
  check_admin_referer('lpgp_save_prices','lpgp_admin_nonce');$incoming=isset($_POST['prices'])&&is_array($_POST['prices'])?wp_unslash($_POST['prices']):[];
  $clean=['services'=>[],'bundles'=>[],'pricing_published'=>empty($incoming['pricing_published'])?false:true,'updated_at'=>current_time('mysql')];
  foreach(lpgp_default_services() as $id=>$service)foreach(lpgp_tiers() as $tier=>$label){
   foreach(['monthly','once'] as $field){$value=$incoming['services'][$id]['tiers'][$tier][$field]??null;$clean['services'][$id]['tiers'][$tier][$field]=max(0,intval($value));}
   $clean['services'][$id]['tiers'][$tier]['scope']=sanitize_textarea_field($incoming['services'][$id]['tiers'][$tier]['scope']??$service['tiers'][$tier]['scope']);
  }
  foreach(lpgp_bundle_defaults() as $id=>$bundle){foreach(lpgp_tiers() as $tier=>$label)foreach(['monthly','once'] as $field){$value=$incoming['bundles'][$id]['tiers'][$tier][$field]??'';$clean['bundles'][$id]['tiers'][$tier][$field]=$value===''?'':max(0,intval($value));}
   foreach(lpgp_tiers() as $tier=>$label){
    $source=isset($incoming['bundles'][$id]['tiers'][$tier]['scopes_text'])?(string)$incoming['bundles'][$id]['tiers'][$tier]['scopes_text']:implode("\n",$bundle['tiers'][$tier]['scopes']);
    $clean['bundles'][$id]['tiers'][$tier]['scopes']=array_values(array_filter(array_slice(array_map('sanitize_text_field',preg_split('/\r?\n/', $source)),0,25),'strlen'));
    $clean['bundles'][$id]['benchmarks'][$tier]['verified']=!empty($incoming['bundles'][$id]['benchmarks'][$tier]['verified'])?'1':'0';
    $clean['bundles'][$id]['benchmarks'][$tier]['monthly']=max(0,intval($incoming['bundles'][$id]['benchmarks'][$tier]['monthly']??0));
    $clean['bundles'][$id]['benchmarks'][$tier]['once']=max(0,intval($incoming['bundles'][$id]['benchmarks'][$tier]['once']??0));
   }
  }
  $old=get_option(LPGP_OPTION,[]);update_option('lpgp_previous_configuration', $old, false);update_option(LPGP_OPTION,$clean,false);
  echo '<div class="notice notice-success"><p>Pricing configuration saved. Previous version retained as a rollback option.</p></div>';
 }
 $c=lpgp_config();echo '<div class="wrap"><h1>Lazy Plex Pricing Management</h1><p><strong>Planning preview:</strong> figures have not been commercially approved. The public pricing switch must only be enabled after checking margins and deliverable equivalence.</p><p><a href="'.esc_url(home_url('/pricing-preview/')).'" target="_blank" rel="noopener">Open pricing preview ↗</a></p><form method="post">';wp_nonce_field('lpgp_save_prices','lpgp_admin_nonce');
 echo '<h2>Individual services — three tiers</h2><table class="widefat striped"><thead><tr><th>Service</th><th>Billing</th><th>Basic ₹</th><th>Intermediate ₹</th><th>Advanced ₹</th></tr></thead><tbody>';
 foreach($c['services'] as $id=>$service){$field=$service['unit']==='once'?'once':'monthly';echo '<tr><th>'.esc_html($service['name']).'</th><td>'.esc_html($field).'</td>';foreach(lpgp_tiers() as $tier=>$label){echo '<td><input style="max-width:140px" type="number" min="0" name="prices[services]['.esc_attr($id).'][tiers]['.esc_attr($tier).']['.$field.']" value="'.esc_attr($service['tiers'][$tier][$field]).'" />';if($field==='monthly'){echo '<br><small>Setup ₹</small><input style="max-width:140px" type="number" min="0" name="prices[services]['.esc_attr($id).'][tiers]['.esc_attr($tier).'][once]" value="'.esc_attr($service['tiers'][$tier]['once']).'" />';}else{echo '<input type="hidden" name="prices[services]['.esc_attr($id).'][tiers]['.esc_attr($tier).'][monthly]" value="0">';}echo '</td>';}echo '</tr>';}
 echo '</tbody></table><h2>Individual deliverable scopes</h2><p>Editing a scope here changes what the website promises. Validate feasibility before publishing.</p>';
 foreach($c['services'] as $id=>$service){echo '<details style="margin:8px 0;border:1px solid #ddd;padding:10px;background:white"><summary><strong>'.esc_html($service['name']).'</strong> — edit tier deliverables</summary><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:12px">';foreach(lpgp_tiers() as $tier=>$label)echo '<label>'.esc_html($label).'<textarea style="width:100%;min-height:90px" name="prices[services]['.esc_attr($id).'][tiers]['.esc_attr($tier).'][scope]">'.esc_textarea($service['tiers'][$tier]['scope']).'</textarea></label>';echo '</div></details>';}
 echo '<h2>Four pillar bundles</h2><p>Unset tiers are displayed as custom-quoted. Get Customers contains all eight capability categories in every tier.</p><table class="widefat striped"><thead><tr><th>Bundle</th><th>Basic monthly ₹</th><th>Intermediate monthly ₹</th><th>Advanced monthly ₹</th><th>Reference matching required</th></tr></thead><tbody>';
 foreach($c['bundles'] as $id=>$bundle){echo '<tr><th>'.esc_html($bundle['title']).'</th>';foreach(lpgp_tiers() as $tier=>$label)echo '<td><input style="max-width:140px" type="number" min="0" placeholder="Custom quote" name="prices[bundles]['.esc_attr($id).'][tiers]['.esc_attr($tier).'][monthly]" value="'.esc_attr($bundle['tiers'][$tier]['monthly']??'').'"></td>';echo '<td>';foreach(lpgp_tiers() as $tier=>$label){$bm=$bundle['benchmarks'][$tier];echo '<fieldset style="border:1px solid #ddd;padding:8px;margin-bottom:8px"><legend>'.esc_html($label).'</legend><label><input type="checkbox" name="prices[bundles]['.esc_attr($id).'][benchmarks]['.esc_attr($tier).'][verified]" value="1" '.checked($bm['verified'],true,false).'> Verified scope</label><br><label>Monthly reference ₹ <input type="number" style="max-width:110px" min="0" name="prices[bundles]['.esc_attr($id).'][benchmarks]['.esc_attr($tier).'][monthly]" value="'.esc_attr($bm['monthly']).'"></label><br><label>One-time reference ₹ <input type="number" style="max-width:110px" min="0" name="prices[bundles]['.esc_attr($id).'][benchmarks]['.esc_attr($tier).'][once]" value="'.esc_attr($bm['once']).'"></label></fieldset>';}echo '</td></tr>';foreach(lpgp_tiers() as $tier=>$label)echo '<input type="hidden" name="prices[bundles]['.esc_attr($id).'][tiers]['.esc_attr($tier).'][once]" value="'.esc_attr($bundle['tiers'][$tier]['once']??'').'">';}
 echo '</tbody></table><h2>Bundle deliverables by tier</h2>';
 foreach($c['bundles'] as $id=>$bundle){echo '<details style="margin:8px 0;border:1px solid #ddd;padding:10px;background:white"><summary><strong>'.esc_html($bundle['title']).'</strong> — edit bundle limits</summary><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:12px">';foreach(lpgp_tiers() as $tier=>$label)echo '<label>'.esc_html($label).'<textarea style="width:100%;min-height:200px" name="prices[bundles]['.esc_attr($id).'][tiers]['.esc_attr($tier).'][scopes_text]">'.esc_textarea(implode("\n",$bundle['tiers'][$tier]['scopes'])).'</textarea></label>';echo '</div><p>Write one line per deliverable. For Get Customers, all eight capability categories remain included regardless of this description.</p></details>';}
 echo '<h2>Commercial publication control</h2><p><label><input type="checkbox" name="prices[pricing_published]" value="1" '.checked($c['pricing_published'],true,false).'> Mark rates approved for public estimates</label></p><p>Do not enable until every service, quantity and pricing comparison is commercially validated. The pricing preview page remains noindex separately.</p>';submit_button('Save pricing configuration','primary','lpgp_save');echo '</form></div>';
}
#!/usr/bin/env python3
"""Read-only sitemap and IndexNow ownership audit. No browser JS or analytics requests."""
import json
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET

def fetch(url):
    request=urllib.request.Request(url,headers={"User-Agent":"LazyPlex-Sitemap-QA/1.0"})
    with urllib.request.urlopen(request,timeout=25) as response:
        body=response.read(6_000_000)
        return response.status,response.geturl(),body

def xml_urls(body):
    root=ET.fromstring(body)
    return [x.text.strip() for x in root.iter() if x.tag.endswith("}loc") or x.tag=="loc" if x.text]

info={}
for host,key in [
 ("lazyplex.com","0f54c7b2013f41a8a041d3d62c44ff41"),
 ("digital.lazyplex.com","98ee5d1795784dcd838024c1ada1bd49")
]:
    url=f"https://{host}/{key}.txt"
    try:
        status,destination,b=fetch(url)
        info[host]={"key_status":status,"key_matches":b.decode("utf-8-sig").strip()==key}
    except Exception as e:
        info[host]={"key_error":str(e)[:250]}

def sitemap(url):
    status,destination,b=fetch(url)
    loc=xml_urls(b)
    if b"<sitemapindex" in b[:500]:
        full=[]
        for part in loc:
            try:
                status2,_,body=fetch(part)
                full.extend(xml_urls(body))
            except Exception as e:
                print("CHILD_ERROR",part,str(e)[:180])
        return {"index":url,"status":status,"children":loc,"urls":list(dict.fromkeys(full))}
    return {"index":url,"status":status,"urls":loc}

for domain,primary in [("lazyplex.com","https://lazyplex.com/sitemap_index.xml"),("digital.lazyplex.com","https://digital.lazyplex.com/sitemap.xml")]:
    try:
        s=sitemap(primary)
        info[domain]["sitemap_status"]=s["status"]
        info[domain]["sitemap_count"]=len(s["urls"])
        info[domain]["sitemap_children"]=s.get("children",[])
        info[domain]["sitemap_noncanonical"]=[x for x in s["urls"] if not x.startswith("https://"+domain+"/")][:15]
        info[domain]["sitemap_urls"]=s["urls"]
    except Exception as e:
        info[domain]["sitemap_error"]=str(e)[:300]

main=set(info.get("lazyplex.com",{}).get("sitemap_urls",[]))
required=[
 "/", "/start/","/compare/","/our-work/","/working-together/","/services/","/pricing/",
 "/solutions/","/growth-advisor/","/industries/","/healthcare/",
 "/seo-ai-search-businesses-2026-guide/",
 "/real-estate-marketing-strategy-developers-site-visits/",
 "/healthcare-marketing-strategy-clinics-hospitals/",
 "/how-to-measure-marketing-roi-leads-revenue/",
 "/crm-automation-lead-follow-up-service-businesses/",
 "/how-to-qualify-sales-leads-lead-scoring/",
 "/seo-vs-google-ads-vs-meta-ads-service-business/",
 "/small-business-digital-marketing-budget-india/",
 "/why-marketing-leads-not-converting/",
 "/how-to-choose-digital-marketing-agency/",
]
noindex=["/request-proposal/","/request-growth-audit/","/pricing-preview/","/checkout/","/cart/","/shop/","/my-account/"]
info["main_required_missing"]=["https://lazyplex.com"+p for p in required if "https://lazyplex.com"+p not in main]
info["main_noindex_in_sitemap"]=["https://lazyplex.com"+p for p in noindex if "https://lazyplex.com"+p in main]
digital=info.get("digital.lazyplex.com",{}).get("sitemap_urls",[])
info["digital_required_missing"]=[p for p in ["https://digital.lazyplex.com/","https://digital.lazyplex.com/services/","https://digital.lazyplex.com/services/search-engine-optimisation/"] if p not in digital]
for v in info.values():
    if isinstance(v,dict):v.pop("sitemap_urls",None)
print("LP_SITEMAP_AUDIT "+json.dumps(info,sort_keys=True))
if info["main_required_missing"] or info["main_noindex_in_sitemap"] or info["digital_required_missing"]:raise SystemExit(1)
if not all(info.get(host,{}).get("key_matches") for host in ("lazyplex.com","digital.lazyplex.com")):raise SystemExit(2)

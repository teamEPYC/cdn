// src/proxy.ts
const BASE_DOMAIN = "https://www.epyc.in"
// set this to TRUE to use RegEx, FALSE otherwise
const textReplacement_useRegex = true;

// set this to TRUE to perform the replacement in a case-insensitive way, FALSE otherwise
const textReplacement_caseInsensitive = true;

// Text replacement configuration ( 'sourceText' : 'replacementText' )

// Script injection configuration ( 'sourceScriptElement' : position )

// Position can be set as follows:
// 0: at the beginning of <header> element ( first child of <head> )
// 1: at the end of <header> element  ( right before </head> )
// 2: at the beginning of <body> element ( first child of <body> )
// 3: at the end of <body> element ( right before </body> )
const scriptInjectionRules = {  
  "<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TFDK3SX');</script>": 0,
};

function replaceText(html, textReplacementRules) {
  if (!textReplacementRules || textReplacementRules.length === 0) {
      return html;
  }

  var regexModifiers = 'g';
  if (textReplacement_caseInsensitive) {
      regexModifiers += 'i';
  }

  for (let k in textReplacementRules) {
      var v = textReplacementRules[k];

      if (textReplacement_useRegex) {
          html = html.replace(new RegExp(k, regexModifiers), v);
      }
      else {
          html = html.split(new RegExp(k, regexModifiers)).join(v);
      }
  }

  return html;
}

function injectScripts(html) {
  if (!scriptInjectionRules || scriptInjectionRules.length === 0) {
      return html;
  }

  var regexModifiers = 'gi';

  for (let k in scriptInjectionRules) {
      var v = scriptInjectionRules[k];

      switch (v) {
          case 0:
          default:
              var i = html.getInjectionIndex(new RegExp("<head>|<head [^>]*?>", regexModifiers));
              html = html.insertAt(i, k);
              break;
          case 1:
              var i = html.getInjectionIndex(new RegExp("</head>", regexModifiers));
              html = html.insertAt(i, k);
              break;
          case 2:
              var i = html.getInjectionIndex(new RegExp("<body>|<body [^>]*?>", regexModifiers));
              html = html.insertAt(i, k);
              break;
          case 3:
              var i = html.getInjectionIndex(new RegExp("</body>", regexModifiers));
              html = html.insertAt(i, k);
              break;
      }
  }

  return html;
}

String.prototype.getInjectionIndex = function (regex) {
  var match = this.match(regex);
  return match
      ? this.lastIndexOf(match[match.length - 1]) + match[match.length - 1].length
      : -1;
}

String.prototype.insertAt = function (index, string) {
  return this.substr(0, index) + string + this.substr(index);
}


function getFirstPartOfPath(pathname) {
  return pathname.split("/")[1];
}

function doesPathnameStartsWithOurList(map, pathname) {  

  const firstPartofPath = getFirstPartOfPath(pathname);
  const pathWithSlash = `/${firstPartofPath}`;
  return { status: map.hasOwnProperty(pathWithSlash), path: pathWithSlash, mapValue: map[pathWithSlash] }
}

function getFinalurl({status, path, map, }) {
  if (status) {
    return map[path]
  } else {
    return BASE_DOMAIN;
  }
}
function appendRestOfTheUrl({FINAL_URL, path, status, originalUrl, }) {
  const fullPath = originalUrl.pathname + originalUrl.search;
  console.log("fullPath, path", fullPath, path);
  let REST_URL = status ? fullPath.replace(path, "") :fullPath;
  return FINAL_URL + REST_URL;
}



var proxy_default = {
  async fetch(request, env, ctx) {
    
    const textReplacementRules = {
      'http:': 'https:',    
    };

    const map = {
      
      "/epyc-demos": "https://epyc-demos.webflow.io",      
      "/magic": "https://magic.epyc.in",
      "/app": "https://web.epyc.workers.dev"      
    };
    

    const url = new URL(request.url);
    
    const { status, path, mapValue } = doesPathnameStartsWithOurList(map, url.pathname);
    if (status && mapValue) {
      textReplacementRules[mapValue] = BASE_DOMAIN + path;
    }
    
    // 
    let FINAL_URL = getFinalurl({status, path, map});   
    
    FINAL_URL = appendRestOfTheUrl({FINAL_URL, path,status, originalUrl: url}); 
    
    let response = await fetch(FINAL_URL, request);
    if (FINAL_URL.endsWith(".xml")) {
      var html = await response.text();
      html = replaceText(html, textReplacementRules);
      // return modified response
      return new Response(html, {
          headers: response.headers
      })
    }

    return response;
  }
};
export {
  proxy_default as default
};
//# sourceMappingURL=proxy.js.map

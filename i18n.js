// Simple client-side i18n for a small static site
(function(){
  var translations = {
    en: {
      langToggle: 'EN',
      navHome: 'Home',
      navAbout: 'About',
      navContact: 'Contact',
  aboutTitle: 'About',
  photographyTitle: 'Photography',
      aboutParagraph: "I'm Francesko Muça, the creative mind behind ShotsByFra — a cinematic videographer and photographer based in Vlora, Albania, passionate about transforming real moments into cinematic stories. I specialize in professional video production, creative photography, and visual storytelling for brands, businesses, and individuals who want to stand out. My work blends emotion, light, and movement to create visuals that not only look beautiful but also connect deeply with the audience. From commercial brand films, travel videos, and documentary-style storytelling to portrait and lifestyle photography, every frame I capture is crafted with intention and cinematic precision.",
    aboutParagraphRight: "At ShotsByFra, my mission is to help clients elevate their visual identity through high-quality content that feels authentic and visually stunning. Whether you’re a local business in Vlora or an international brand looking for a cinematic filmmaker and content creator, I offer complete video and photo production services — from concept and direction to editing and color grading. I bring a creative yet professional approach to every project, ensuring each story is told with emotion, impact, and timeless style. Let’s create something powerful together — visuals that inspire, move, and last.",
  linkPhotography: 'Photography',
  aboutName: 'Francesko Muça',
  aboutBrand: 'ShotsByFra',
      linkVideography: 'Videography',
      contactTitle: 'Get in touch',
      labelFirst: 'First name',
      labelLast: 'Last name',
      labelEmail: 'Email',
      labelSubject: 'Subject',
      labelMessage: 'Message',
      btnSend: 'Send'
    },
    al: {
      langToggle: 'AL',
      navHome: 'Hyrje',
      navAbout: 'Info',
      navContact: 'Kontakt',
  aboutTitle: 'Info',
  photographyTitle: 'Fotografi',
  aboutParagraph: "Unë jam Francesko Muça, mendja krijuese pas ShotsByFra — një videograf dhe fotograf kinematografik me bazë në Vlorë, Shqipëri, i apasionuar pas transformimit të momenteve reale në histori kinematografike. Unë specializohem në prodhimin profesional të videove, fotografinë krijuese dhe rrëfimin vizual të historive për marka, biznese dhe individë që duan të dallohen. Puna ime përzien emocionin, dritën dhe lëvizjen për të krijuar pamje që jo vetëm duken bukur, por edhe lidhen thellë me audiencën. Nga filmat e markave komerciale, videot e udhëtimit dhe rrëfimi i historive në stilin dokumentar deri te fotografia e portreteve dhe e stilit të jetesës, çdo kuadër që kap është krijuar me qëllim dhe saktësi kinematografike.",
    aboutParagraphRight: "Në ShotsByFra, misioni im është t'i ndihmoj klientët të ngrenë identitetin e tyre vizual përmes përmbajtjes me cilësi të lartë që ndihet autentike dhe vizualisht mahnitëse. Qoftë një biznes lokal në Vlorë apo një markë ndërkombëtare që kërkon një regjisor kinematografik dhe krijues përmbajtjeje, unë ofroj shërbime të plota prodhimi videosh dhe fotografish - nga koncepti dhe regjia deri te redaktimi dhe klasifikimi i ngjyrave. Unë sjell një qasje krijuese, por profesionale në çdo projekt, duke siguruar që çdo histori të tregohet me emocion, ndikim dhe stil të përjetshëm. Le të krijojmë diçka të fuqishme së bashku - pamje që frymëzojnë, prekin dhe zgjasin.",
  linkPhotography: 'Fotografi',
  aboutName: 'Francesko Muça',
  aboutBrand: 'ShotsByFra',
      linkVideography: 'Videografi',
      contactTitle: 'Na kontaktoni',
      labelFirst: 'Emri',
      labelLast: 'Mbiemri',
      labelEmail: 'Email',
      labelSubject: 'Subjekti',
      labelMessage: 'Mesazhi',
      btnSend: 'Dërgo'
    }
  };

  function apply(locale){
    // apply text content
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      var text = translations[locale] && translations[locale][key];
      if(!text) return;
      el.textContent = text;
    });

    // apply placeholders for inputs/textareas using data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el){
      var key = el.getAttribute('data-i18n-placeholder');
      var text = translations[locale] && translations[locale][key];
      if(!text) return;
      try{ el.placeholder = text; }catch(e){}
    });
  }

  function setLocale(locale){
    localStorage.setItem('shotsbyfra_locale', locale);
    apply(locale);
  }

  // build a visible toggle if .lang-toggle exists
  function initToggle(){
    var toggles = document.querySelectorAll('.lang-toggle');
    if(!toggles || !toggles.length) return;
    var current = localStorage.getItem('shotsbyfra_locale') || 'en';
    apply(current);

    toggles.forEach(function(node){
      // make the toggle clickable and announce current language
      node.setAttribute('role','button');
      node.setAttribute('tabindex','0');
      node.style.cursor = 'pointer';
      // show only the two-letter code
      node.textContent = translations[current] && translations[current].langToggle ? translations[current].langToggle : current.toUpperCase();
      node.setAttribute('aria-label', current === 'en' ? 'English' : 'Shqip');
      node.addEventListener('click', function(){
        current = (current === 'en') ? 'al' : 'en';
        // update toggle label
        node.textContent = translations[current] && translations[current].langToggle ? translations[current].langToggle : current.toUpperCase();
        setLocale(current);
      });
      node.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); node.click(); } });
    });
  }

  // run on DOMContentLoaded
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initToggle);
  } else initToggle();

  // expose for debugging
  window.__shotsI18n = { setLocale:setLocale, apply:apply };
})();

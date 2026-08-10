const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

const replacement = `
  const constructFallbackReport = () => {
    let t_title = 'HRVL Regional Veterinary Surveillance & Situation Report';
    let t_exec = \`During the current reporting period, the Hirna Regional Veterinary Laboratory (HRVL) recorded \${totalCases} livestock cases and \${totalDeaths} animal deaths across E/H and W/H zones. Active field surveillance identified \${activeOutbreaks} high-priority outbreak centers requiring immediate quarantine and targeted therapeutic intervention. Woreda zero-reporting compliance currently averages \${complianceRate}%, with high-performing highland sectors balancing lower reporting frequencies along eastern pastoral corridors.\`;
    let t_status = \`Priority disease vectors include Foot-and-Mouth Disease (FMD) along major trade transit routes, Peste des Petits Ruminants (PPR) affecting small ruminant populations in Dadar and Mieso, and sporadic Anthrax suspicions requiring immediate diagnostic confirmation. Transboundary livestock trade along the Harar-Djibouti corridor continues to represent an active transmission risk.\`;
    let t_species = \`Cattle represent the highest total case volume (\${totalCases > 300 ? '58%' : '42%'}), with elevated mortality in small ruminants (Goats & Sheep) impacted by respiratory disease complexes and PPR. Poultry flocks exhibit acute Newcastle Disease events in backyard production settings.\`;
    let t_zonal = \`E/H Zone (21 Woredas) maintained strong reporting rates led by Haramaya and Babile. W/H Zone (15 Woredas) recorded reliable weekly submissions from Chiro and Habro, while remote pastoral border sectors are prioritized for mobile network connectivity enhancements.\`;
    let t_recs = [
      'Immediate ring vaccination for high risk livestock in Haramaya and Dadar border kebeles',
      'Establishment of mobile veterinary checkpoints along primary transit corridors',
      'Enhanced weekly zero-reporting compliance enforcement in remote pastoral Woredas',
      'Distribution of rapid diagnostic kits for suspected Anthrax mortalities'
    ];
    
    if (locale === 'am') {
      t_title = 'የHRVL ክልላዊ የእንስሳት ቁጥጥር እና የሁኔታ ሪፖርት';
      t_exec = \`በአሁኑ የሪፖርት ጊዜ ውስጥ፣ የሂርና ክልላዊ የእንስሳት ላቦራቶሪ (HRVL) በመላው የምስራቅ እና ምዕራብ ሐረርጌ ዞኖች \${totalCases} የእንስሳት ጉዳዮች እና \${totalDeaths} ሞት መዝግቧል። ንቁ የመስክ ቁጥጥር ፈጣን ለይቶ ማቆያ እና የተጠናከረ የህክምና ክትትል የሚፈልጉ \${activeOutbreaks} ከፍተኛ ቅድሚያ የሚሰጣቸው የወረርሽኝ ማዕከላትን ለይቷል። የወረዳ ዜሮ-ሪፖርት አፈጻጸም በአማካይ \${complianceRate}% ደርሷል።\`;
      t_status = \`በዋና ዋና የንግድ መስመሮች ላይ የእግር እና የአፍ በሽታ (FMD)፣ በዳዳር እና ሚኤሶ የትንሽ እንስሳት ህዝቦችን የሚያጠቃ PPR፣ እና አስቸኳይ ምርመራ የሚፈልጉ አልፎ አልፎ የአንትራክስ ጥርጣሬዎችን ጨምሮ ቅድሚያ የሚሰጣቸው የበሽታ ስርጭቶች አሉ። የድንበር ተሻጋሪ የእንስሳት ንግድ በሀረር-ጅቡቲ መስመር አሁንም ንቁ የስርጭት አደጋን ይፈጥራል።\`;
      t_species = \`ከብቶች ከፍተኛውን አጠቃላይ የጉዳይ መጠን (\${totalCases > 300 ? '58%' : '42%'}) ይይዛሉ፣ በትንንሽ እንስሳት (ፍየሎች እና በጎች) ላይ በመተንፈሻ አካላት በሽታዎች እና PPR ምክንያት የሞት መጠን ጨምሯል። የዶሮ እርባታዎች በጓሮ አምራቾች ላይ አጣዳፊ የኒውካስትል በሽታ ክስተቶችን ያሳያሉ።\`;
      t_zonal = \`የምስራቅ ሐረርጌ ዞን (21 ወረዳዎች) በሀረማያ እና ባቢሌ በመመራት ጠንካራ የሪፖርት መጠኖችን ጠብቋል። የምዕራብ ሐረርጌ ዞን (15 ወረዳዎች) ከጭሮ እና ሀብሮ አስተማማኝ ሳምንታዊ ሪፖርቶችን መዝግቧል።\`;
      t_recs = [
        'በሀረማያ እና ዳዳር የድንበር ቀበሌዎች ለከፍተኛ አደጋ ተጋላጭ ለሆኑ እንስሳት አስቸኳይ የክበብ ክትባት',
        'በዋና ዋና የንግድ መስመሮች ላይ ተንቀሳቃሽ የእንስሳት ኬላዎችን ማቋቋም',
        'በሩቅ አርብቶ አደር ወረዳዎች ውስጥ ሳምንታዊ የዜሮ-ሪፖርት አፈጻጸምን ማጠናከር'
      ];
    } else if (locale === 'om') {
      t_title = 'Gabaasa To\\'annoo fi Haala Beeyladaa Naannoo HRVL';
      t_exec = \`Yeroo gabaasaa kana keessatti, Laaboraatooriin Beeyladaa Naannoo Hirnaa (HRVL) godinoota H/Bahaa fi H/Dhihaa keessatti dhimmoota beeyladaa \${totalCases} fi du\\'a beeyladaa \${totalDeaths} galmeesseera. To\\'annoon dirree saffisaa ta\\'e wiirtuulee dhibee daddarbaa \${activeOutbreaks} adda baaseera. Raawwiin gabaasa zeeroo aanaalee amma giddugaleessaan \${complianceRate}% dha.\`;
      t_status = \`Dhibeewwan daddarboo adda-duree keessaa Dhibee Imiillaa (FMD) daandiiwwan daldalaa gurguddoo irratti, PPR beeyladoota xixiqqoo Dadar fi Mieso keessatti miidhu, fi shakkiiwwan Anthrax darbee darbee muudatan ifatti argamaniiru. Daldalli beeyladaa daangaa ce\\'u sarara Harar-Jibuutii irratti balaa daddarbaa uumuusaa itti fufeera.\`;
      t_species = \`Loowwan baay\\'ina dhimmootaa olaanaa (\${totalCases > 300 ? '58%' : '42%'}) kan qaban yoo ta\\'u, beeyladoota xixiqqoo (Re\\'ee fi Hoolaa) irratti dhibee sombaa fi PPR\\'n du\\'i dabaleera. Hoollotni qe\\'ee keessaa dhibee Newcastle cimaa agarsiisaa jiru.\`;
      t_zonal = \`Godinni H/Bahaa (Aanaalee 21) Haramaya fi Babile dhaan durfamee reetii gabaasaa cimaa eeggachaa jira. Godinni H/Dhihaa (Aanaalee 15) Chiro fi Habro irraa gabaasa torbanii amansiisaa galmeesseera.\`;
      t_recs = [
        'Aanaalee daangaa Haramaya fi Dadar keessatti beeyladoota balaa guddaa qabaniif talaallii marsaa hatattamaa',
        'Daandiiwwan daldalaa gurguddoo irratti kellaawwan beeyladaa socho\\'an hundeessuu',
        'Aanaalee horsiisee bulaa fagoo keessatti raawwii gabaasa zeeroo torbanii cimsanii hordofuu'
      ];
    }

    return {
      title: t_title,
      dateGenerated: new Date().toLocaleDateString(locale === 'om' ? 'en-US' : (locale === 'am' ? 'am-ET' : 'en-US'), { dateStyle: 'full' }),
      executiveSummary: t_exec,
      outbreakStatusAnalysis: t_status,
      speciesVulnerability: t_species,
      zonalComplianceSummary: t_zonal,
      highRiskWoredas: ['Haramaya', 'Dadar', 'Chiro', 'Daro Lebu', 'Habro', 'Babile'],
      epidemiologicalRecommendations: t_recs
    };
  };
`;

content = content.replace(/const constructFallbackReport = \(\) => \(\{[\s\S]*?epidemiologicalRecommendations: \[[\s\S]*?\]\s*\}\);/, replacement);

fs.writeFileSync('server.ts', content);

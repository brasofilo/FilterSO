### (Chrome only)

![script logo][logo] **Find good questions to answer.**  

The script will filter all Stack Exchange sites questions pages,  
hiding them by score, views, user reputation and accepted answers.  
Uses jQuery to hide question items live on the page and only runs on pages where questions are being listed.

Depending on the page and the configuration, very few questions will show up, and chances are good that they are interesting. If somebody already gave a negative vote, why look at it? If it's a new user, sorry to say, but very few *write* a good question or display research skills. Anyway, this is a tool focused on Power Answerers, who already saw too much.

<kbd>  
[![][ss]][ss]</kbd>

&diams; The diamond icon was on the very [stack sprite][sosp].  
So took the liberty to use it and make our very own moderator menu :)

---
##Usage
Adjust the votes, views and reputation thresholds, select if questions with accepted answers should be hidden, enable the filter and save. To disable, just uncheck the *Enable filter* option and save.

<kbd>  
![ss2][ss2]</kbd>

The ranges can be modified using the button <kbd>(?)</kbd>:

<kbd>  
![ss3][ss3]</kbd>

---
##Installing

 - For now, *the script is only compatible with Chrome*. 
 - A **browser extension for managing user scripts is required**, like [Tampermonkey][TM] or other similar extensions.  
 - After installing the extension, clicking the ["download / install"][DL] button below should bring up a dialog asking if you want to install the script.

> ### [<kbd>Install with Tampermonkey</kbd>][DL]  
> <sub>[View source][source]</sub>

---
##Code
Unfortunately, I couldn't manage to make the sliders work on Firefox. I'm by no means an expert on userscripts, all contributions and forks are welcome.

<sup>- Version 1.0.1 - Bug fix, page detection must be earlier.</sup>
<sup>- Version 1.0 - Added views. UI upgrade. Custom ranges settings. Localstorage is now used instead of cookies.</sup>  
<sup>- Version 0.4 - Detect if user is mod and use different icon. Expanded range of selection (votes -6/6 and rep 0/250).</sup>  
<sup>- Version 0.3 - Changed script name, it's not exclusive for SO anymore. Added /unanswered tab. More information about the filtering status on the button's tooltip.</sup>  
<sup>- Version 0.2 - Support for all sites added.</sup>  
<sup>- Version 0.1 - Script launch.</sup>

---

  [logo]: http://i.stack.imgur.com/L4CwZ.png
  [ss]: http://i.stack.imgur.com/Ax3Wg.png
  [ss2]: http://i.stack.imgur.com/PyCK1.png
  [ss3]: http://i.stack.imgur.com/Gg45w.png
  [sosp]: http://cdn.sstatic.net/img/share-sprite-new.png?v=204b1e0e421b
  [DL]: https://raw.githubusercontent.com/brasofilo/FilterSO/master/FilterSO.user.js "Download / install FilterSO from Gist"
  [source]: https://github.com/brasofilo/FilterSO/blob/master/FilterSO.user.js "View FilterSO source code"
  [TM]: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo "Chrome Web Store: Tampermonkey"

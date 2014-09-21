### (Chrome only)

![script logo][logo] **Makes easier to find good questions to answer.**  

The script will filter all Stack Overflow `/questions/*` pages,  
hiding them by score, user reputation and accepted answers.  
Uses jQuery to hide question items on the page and doesn't run if the URL is `/question/ID`.

Depending on the page and the configuration, very few questions will show up, and chances are good that they are interesting. If somebody already gave a negative vote, why look at it? If it's a new user, sorry to say, but very few *write* a good question or display research skills. Anyway, this is a tool focused on Power Answerers, who already saw too much.

<kbd>  
[![][ss]][ss]</kbd>

&diams; The diamond icon was on the very [stack sprite][sosp].  
So took the liberty to use it and make our very own moderator menu :)

---
##Usage
Adjust the votes and reputation thresholds, select if questions with accepted answers should be hidden, enable the filter and save. To disable, just uncheck the *Enable filter* option and save.

---
##Installing
For now, the script is only compatible with Chrome. You can use [TamperMonkey][TM] extension for managing user scripts, or other similar extensions.  After installing the extension, clicking the ["download / install"][DL] button below should bring up a dialog asking you if you want to install the script. 

> ### [<kbd>Download / Install</kbd>][DL]  
> <sub>[View source][source]</sub>

---
##Code
Unfortunately, I couldn't manage to make the sliders work on Firefox. I'm by no means an expert on userscripts, all contributions, forks and project takeover are welcome.

  [logo]: http://i.stack.imgur.com/sSRak.png
  [ss]: http://i.stack.imgur.com/Qn0SM.png
  [sosp]: http://cdn.sstatic.net/img/share-sprite-new.png?v=204b1e0e421b
  [DL]: https://raw.githubusercontent.com/brasofilo/FilterSO/master/FilterSO.user.js "Download / install FilterSO from Gist"
  [source]: https://github.com/brasofilo/FilterSO/blob/master/FilterSO.user.js "View FilterSO source code"
  [TM]: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo "Chrome Web Store: Tampermonkey"

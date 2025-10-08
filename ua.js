(function () {
'use strict';

   if (!localStorage.getItem('language')) {  
       localStorage.setItem('language', 'uk');  
       localStorage.setItem('tmdb_lang', 'uk');  
   }

})();

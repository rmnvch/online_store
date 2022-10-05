# RS School JavaScript/Front-end 2022 online-store task
Private repository for @rmnvch
<br>
App link: https://rolling-scopes-school.github.io/rmnvch-JSFE2022Q1/online-store/
<br> Short video introduction link: https://youtu.be/dB8cRDami58
<br>This App is an implementation of product list page of a fake online vintage guitar store. App has no backend part all data's stored locally in db.json.
<br>Key features:
<ol>
<li>
  The search field allows to go through all matches in product cards including name, model, manufacturing year.   
</li>
<li>
  Different options of sorting data is available. User can choose from predefined select list the way he wants to sort product list.   
</li>
<li>
  User can filter products according to product brand, type, current availability, year of manufacture and price. Those features are implemented by checkboxes, radio buttons and range sliders. Filter types could be different for different type of products.     
</li>
<li>
  Search and any of the filters (several at once) can be applied at once to ensure better user experience.     
</li>
<li>
  All selected by user filter options are stored in SessionStorage which allows to restore chosed options after page reload. USer can clear SessionStorage by clicking "default settings"       
</li>
<li>
  Current filter settings can be reset to default by pressing "reset all". This option does not affect SessionStorage which is being cleared only by clicking "default settings"
</li>
<li>
  User can add items to cart. Quantity of added items is displayed on the top left corner on the cart icon. The second click on the 'add to cart' deletes item from cart.
  Cart view is not implemented.
</li>
</ol>
<br>
Additional UI features:
<ul>
<li>
  Custom checkboxes and radio buttons
</li>
<li>
  Current product quatity is displayed. It changes once user applies different filters. 
</li>
<li>
  Labels displayed on cards showing product availability. 
</li>
</ul>

Used technlogies:
<br>TypeScript
<br>Webpack
<br>EsLint
<br>Prettier
<br>noUiSlider (JavaScript range slider) 

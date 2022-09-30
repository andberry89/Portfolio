"use strict";

(function() {

  const dg = {

    // reference to the data table
    dataTable : document.getElementById('data'),

    // reference to the data table inputs
    allInputs : document.getElementById('data').getElementsByTagName('input'),

    // readonly inputs node list (dynamic)
    lockedInputs : document.getElementById('data').getElementsByClassName('readonly'),
    
    // marked inputs node list (dynamic)
    highlightedInputs : document.getElementById('data').getElementsByClassName('marked'),

    // inputs with data (dynamic)
    inputsWithData : document.getElementById('data').getElementsByClassName('hasData'),

    // inputs with invalid data (dynamic)
    inputsWithInvalidData : document.getElementById('data').getElementsByClassName('invalid'),

    // buttons for mass unlocks, highlight removal, and value clearing
    clearLocksBtn : document.createElement('input'),
    clearHighlightsBtn : document.createElement('input'),
    clearDataBtn : document.createElement('input'),

    // reference to the hidden study ID input, to retrieve the specific survey
    currentStudy : document.querySelector('#submitHolder input[name="studyID"]'),

    //reference to the error paragraph
    errorPara : document.getElementById('error'),

    //reference to the submit button
    submitBtn : document.getElementById('submitBtn'),

    init : function() {

      // assign listeners to the table for event delegation
      this.dataTable.addEventListener('click', this.updateCell, false);
      this.dataTable.addEventListener('focusout', this.updateCell, false);
      this.dataTable.addEventListener('keyup', this.checkData, false);

      // assign a listener to the submit button to generate cookies
      this.submitBtn.addEventListener('click', this.generateCookies, false);

      // assign a listener to the document for page visibility
      document.addEventListener('visibilitychange', function() {
          if (document.visibilityState === 'hidden') {
            dg.generateCookies();
          }
      }); 

      // set up the help icon and text
      this.generateHelp();

      // set up the div with the buttons to clear locks and highlights
      this.generateClearingControls();

      // assign aria-label and title attributes
      this.generateAriaLabelsTitles();

      // retrieve cookies, check inputs for locked/highlighted buttons
      this.getCookies();

    },

    generateHelp : function() {
    
      // wrapper element for image and help box
      const wrapper = document.getElementById('helpWrapper');
      
      // code string for image and help box
      let str = '<a href="#" id="helpIcon" aria-controls="helpBox" aria-expanded="false">'
      str += '<img src="i/help.png" alt="Help"></a>';
      str += '<ul id="helpBox" class="remove">';
      str += '<li>To lock a cell (prevent edits) SHIFT + click on the cell; to unlock repeat this process.</li>';
      str += '<li>To highlight a cell ALT + click on the cell; to remove the highlight repeat the process.</li>';
      str += '<li>To clear a cell\'s value CTRL + click on the cell.</li>';
      str += '</ul>';
      wrapper.innerHTML = str;

      this.theIcon = document.getElementById('helpIcon');
      this.instructions = document.getElementById('helpBox');

      // assign click event to the Help icon
      this.theIcon.addEventListener('click', this.showHideHelp, false);
      
    },

    // toggle show/hide of the help box
    showHideHelp : function(evt) {
    
      dg.instructions.classList.toggle('remove');
      dg.theIcon.getAttribute('aria-expanded') === 'false' ? dg.theIcon.setAttribute('aria-expanded', 'true') : dg.theIcon.setAttribute('aria-expanded', 'false');
      evt.preventDefault();
    
    },
    
    // set up the div with the two buttons to clear locks and highlights
    generateClearingControls : function() {

      const container = document.createElement('div');
      container.id = 'clearingControls';
      this.clearLocksBtn.type = this.clearHighlightsBtn.type = this.clearDataBtn.type = 'button';
      this.clearLocksBtn.value = 'Unlock Cells';
      this.clearHighlightsBtn.value = 'Remove Cell Highlights';
      this.clearDataBtn.value = 'Remove All Data';
      this.clearLocksBtn.className = this.clearHighlightsBtn.className = this.clearDataBtn.className = 'hide';
      container.appendChild(this.clearLocksBtn);
      container.appendChild(this.clearHighlightsBtn);
      container.appendChild(this.clearDataBtn);
      container.addEventListener('click', this.massUpdates, false);
      document.querySelector('body').appendChild(container);
    
    },

    // remove all locks / all highlights / all data as well as the related control button
    massUpdates : function(evt) {
    
      const btn = dg.findTarget(evt, 'input', this);
      
      if (!btn) { return; }

      switch (btn.value) {

        case 'Unlock Cells' :

          while (dg.lockedInputs.length) {
            dg.lockedInputs[0].readOnly = false;
            dg.lockedInputs[0].title = '';

            // sequencing matters here - drop the input out of the node list last to avoid
            // errors related to trying to set attributes on undefined element node references
            dg.lockedInputs[0].classList.remove('readonly');
          }

          break;

        case 'Remove Cell Highlights' :

          while (dg.highlightedInputs.length) {
            dg.highlightedInputs[0].classList.remove('marked');
          }

          break;

        case 'Remove All Data' :

          while (dg.inputsWithData.length) {
            dg.inputsWithData[0].value = '';
            dg.inputsWithData[0].classList.remove('hasData');
          }

          while (dg.inputsWithInvalidData.length) {
            dg.inputsWithInvalidData[0].value = '';
            dg.inputsWithInvalidData[0].removeAttribute('aria-invalid');
            dg.inputsWithInvalidData[0].classList.remove('invalid');
          }

          dg.checkInvalidData();

          break;

      }

      // remove the control button
      btn.classList.toggle('hide'); 
    
    },

    generateAriaLabelsTitles : function() {

      // node list of inputs in table
      const inputs = document.querySelectorAll('#data input');

      for (const input of inputs) {

        // locate the subject
        const subject = input.parentNode.parentNode.cells[0].firstChild.nodeValue;

        // locate the measure
        const measure = dg.dataTable.rows[0].cells[input.parentNode.cellIndex].firstChild.nodeValue;

        // build the string
        const str = subject + ', ' + measure;
      
        // assign the aria-label and title
        input.setAttribute('aria-label', str);
        input.parentNode.title = str;

      }

    },
    
    updateCell : function(evt) {
    
      // reference to text input box clicked
      const textBox = dg.findTarget(evt, 'input', this);
    
      // if the click path did not involve a text input stop processing
      if (!textBox) { return; }
    
      // if the SHIFT key was pressed lock down the field or unlock the field
      if (evt.shiftKey) { 
      
        textBox.readOnly = (textBox.readOnly) ? false : true;
        textBox.classList.toggle('readonly');
        textBox.title = (textBox.title) ? '' : 'The cell is locked and cannot be edited; SHIFT + click to unlock it';
        dg.lockedInputs.length ? dg.clearLocksBtn.classList.remove('hide') : dg.clearLocksBtn.classList.add('hide');

      }
      
      // if the ALT key was pressed highlight the text input or remove its highlight
      if (evt.altKey) {

        textBox.classList.toggle('marked');
        dg.highlightedInputs.length ? dg.clearHighlightsBtn.classList.remove('hide') : dg.clearHighlightsBtn.classList.add('hide');
     
      }
      
      // if the CTRL key was pressed wipe the text input value
      if (evt.ctrlKey) {
      
        textBox.value = '';
      
      }

      if (textBox.value.length > 0) {
        textBox.classList.add('hasData');
        dg.clearDataBtn.classList.remove('hide');
      }
      else {
        textBox.classList.remove('hasData');
        (dg.inputsWithData.length > 0) ? dg.clearDataBtn.classList.remove('hide') : dg.clearDataBtn.classList.add('hide');
      }
    
    },

    checkData : function(evt) {

        // reference to text input box clicked
      const textBox = dg.findTarget(evt, 'input', this);
    
      // if the click path did not involve a text input stop processing
      if (!textBox) { return; }

      dg.isDataValid(textBox, textBox.value);

    },

    isDataValid (textBox, str) {
        // regex to check if input is valid, true if blank
        const invalidInput = /[^0-9\.]/.test(str);

        invalidInput ? textBox.classList.add('invalid') : textBox.classList.remove('invalid');
        invalidInput ? textBox.setAttribute('aria-invalid', 'true') : textBox.removeAttribute('aria-invalid');

        dg.checkInvalidData();
    },

    checkInvalidData : function() {

        // error message if data is invalid
        const msg = 'Saving disabled until invalid data is corrected.';
        
        (dg.inputsWithInvalidData.length > 0) ? dg.errorPara.innerText = msg : dg.errorPara.innerText = '';
        (dg.inputsWithInvalidData.length > 0) ? dg.submitBtn.setAttribute('disabled', 'true') : dg.submitBtn.removeAttribute('disabled');
    
    },

    generateCookies : function() {

        // cookiePrefix grabs the value from the hidden studyID input
        const cookiePrefix = dg.currentStudy.value + '_';

        const totalInputs = dg.allInputs.length;

        // loop through all cells
        for (let i = 0; i < totalInputs; i++) {
            // store a cookie using the survey + input name as cookie name
            // the value will contain a comma-separated string that includes value, locked status, and highlight status
            const textBox = dg.allInputs[i];
            let val = '';
            (textBox.value === '') ? val = '' : val = textBox.value;
            (textBox.classList.contains('readonly')) ? val += ',locked' : val+= ',unlocked';
            (textBox.classList.contains('marked')) ? val += ',marked' : val += ',unmarked';
            dg.createCookie(cookiePrefix + textBox.name, val, 'Lax', false, false, false, false);
        }

    },

    getCookies(){

        const totalInputs = dg.allInputs.length;
        const cookiePrefix = dg.currentStudy.value + '_';

        // loop through all the inputs and assign any values/classes based off cookies
        for (let i = 0; i < totalInputs; i++){

            const textBox = dg.allInputs[i];
            const cookieName = dg.findCookie(cookiePrefix + textBox.name);
            // creates an array that holds value, readonly status, and highlight status
            if (cookieName) {

                const vals = (dg.findCookie(cookiePrefix + textBox.name)).split(',');
            
                if (vals[0] !== '') {textBox.value = vals[0];}
                (textBox.value === '') ? textBox.classList.remove('hasData') : textBox.classList.add('hasData');
                dg.isDataValid(textBox, textBox.value);
                (vals[1] === 'locked') ? textBox.classList.add('readonly') : textBox.classList.remove('readonly');
                (vals[1] === 'locked') ? textBox.readOnly = true : textBox.readOnly = false;
                (vals[2] === 'marked') ? textBox.classList.add('marked') : textBox.classList.remove('marked');
            }
        }

        dg.lockedInputs.length ? dg.clearLocksBtn.classList.remove('hide') : dg.clearLocksBtn.classList.add('hide');
        dg.highlightedInputs.length ? dg.clearHighlightsBtn.classList.remove('hide') : dg.clearHighlightsBtn.classList.add('hide');
        dg.inputsWithData.length ? dg.clearDataBtn.classList.remove('hide') : dg.clearDataBtn.classList.add('hide');


    },

    findTarget : function(evt, targetNode, container) {
      let currentNode = evt.target;
      while (currentNode && currentNode !== container) {  
        if (currentNode.nodeName.toLowerCase() === targetNode.toLowerCase()) { return currentNode; }
        else { currentNode = currentNode.parentNode; }
      }
      return false;
    },

    findCookie : function(name) {
     
        const query = name + "=";
       
        // length of the cookie name plus the = sign
        const queryLength = query.length;
       
        // total cookie length
        const cookieLength = document.cookie.length;
       
        let i=0;
       
        while (i<cookieLength) {
       
          // numerical position where we can try to find a match
          let position = i + queryLength;
       
          // extract the characters from the counter up to
          // the position and see if they match our query
          if (document.cookie.substring(i,position) === query) {
       
             // if we find a match send that position
             // to the findCookieValue method
             return dg.findCookieValue(position);
       
          }
       
          // look for the next empty space to advance further
          // down the document.cookie string
          i = document.cookie.indexOf(" ", i) + 1;
       
          // if you cannot find anything via indexOf the result
          // is -1, so we added 1 to that, resulting in 0
          // if nothing else can be found you're done looking
          if (i === 0) { break; }
       
        }
       
        // if you did not find anything you will be out here
        // and returning null
        return null;
       
      },

    createCookie : function(name,value,samesite,expiration,path,domain,secure) {
     
        let data = name + "=" + escape(value);
       
        if (samesite) { data += "; SameSite=" + samesite; }
       
        if (expiration) {
          let expiresAt = new Date();
          expiresAt.setTime(expiration);
          data += "; expires=" + expiresAt.toGMTString();
        }
       
        if (path) { data += "; path=" + path; }
       
        if (domain) { data += "; domain=" + domain; }
       
        if (secure) { data += "; secure"; }
       
        document.cookie = data;
       
      },

      findCookieValue : function(position) {
     
        let endsAt = document.cookie.indexOf(";", position);
        if (endsAt === -1) { endsAt = document.cookie.length; }
        return unescape(document.cookie.substring(position,endsAt));
       
      }

  }

  dg.init();

})();
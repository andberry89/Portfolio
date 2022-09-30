"use strict";

(function() {

  const dg = {

    // reference to the data table
    dataTable : document.getElementById('data'),

    // readonly inputs node list (dynamic)
    lockedInputs : document.getElementById('data').getElementsByClassName('readonly'),
    
    // marked inputs node list (dynamic)
    highlightedInputs : document.getElementById('data').getElementsByClassName('marked'),

    // inputs with data (dynamic)
    inputsWithData : document.getElementById('data').getElementsByClassName('hasData'),

    // buttons for mass unlocks, highlight removal, and value clearing
    clearLocksBtn : document.createElement('input'),
    clearHighlightsBtn : document.createElement('input'),
    clearDataBtn : document.createElement('input'),    

    init : function() {

      // assign listeners to the table for event delegation
      this.dataTable.addEventListener('click', this.updateCell, false);
      this.dataTable.addEventListener('focusout', this.updateCell, false);

      // set up the help icon and text
      this.generateHelp();

      // set up the div with the buttons to clear locks and highlights
      this.generateClearingControls();

      // assign aria-label and title attributes
      this.generateAriaLabelsTitles();

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

    findTarget : function(evt, targetNode, container) {
      let currentNode = evt.target;
      while (currentNode && currentNode !== container) {  
        if (currentNode.nodeName.toLowerCase() === targetNode.toLowerCase()) { return currentNode; }
        else { currentNode = currentNode.parentNode; }
      }
      return false;
    }

  }

  dg.init();

})();
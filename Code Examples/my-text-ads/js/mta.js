'use strict';

(function() {

    const mta = {

        // reference to container element holding layout
        outerBox : document.querySelector('#container'),

        // reference to the form field
        formField : document.getElementById('form'),

        // references to the lists
        detailsList : document.querySelector('.formList'),
        keyList : document.getElementById('keyList'),

        // reference to the save button
        saveBtn : document.querySelector('#action input'),

        // dynamic node list to keep track of keyword fields
        totalKeys : document.getElementsByName('keyphrase[]'),

        // generated element nodes
        column : document.createElement('div'),
        hdr : document.createElement('h3'),
        adspace : document.createElement('div'),
        title : document.createElement('div'),
        link : document.createElement('a'),
        description : document.createElement('div'),
        visible_url : document.createElement('div'),
        msg1 : document.createElement('p'),
        msg2 : document.createElement('p'),
        addBtn : document.createElement('input'),

        // flags for URL validity
        visible_url_flag : true,
        title_url_flag : true,

        setupPreview : function() {
            
            // assign id's for proper styling
            mta.column.id = 'preview';      
            mta.adspace.id = 'adspace';
            mta.title.id = 'title';
            mta.description.id = 'desc_txt';
            mta.visible_url.id = 'vurl_txt';
            mta.msg1.id = 'msg1';
            mta.msg2.id = 'msg2';
            mta.addBtn.id = 'addAnotherBtn';

            // assemble and append the node tree
            mta.column.appendChild(mta.hdr).appendChild(document.createTextNode('Real-time Ad Preview:'));
            mta.adspace.appendChild(mta.title).appendChild(mta.link).appendChild(document.createTextNode(''));
            mta.adspace.appendChild(mta.description).appendChild(document.createTextNode(''));
            mta.adspace.appendChild(mta.visible_url).appendChild(document.createTextNode(''));
            mta.column.appendChild(mta.adspace);
            mta.outerBox.appendChild(mta.column);
                
        },

        insertMessages : function() {

            // assign properties to nodes
            mta.msg1.id = 'msg1';
            mta.msg2.id = 'msg2';
            mta.addBtn.id = 'addAnotherBtn';
            mta.addBtn.type = 'button';
            mta.addBtn.value = 'Add Another';

            // assemble and append the node tree
            mta.msg1.appendChild(document.createTextNode('\'Title URL\' and \'Visible URL\' are added to the preview when valid; if invalid their field name is red and boldface.'));
            mta.msg2.appendChild(document.createTextNode('Up to 5 keywords / keyphrases can be entered.'));
            mta.msg2.appendChild(mta.addBtn);
            mta.detailsList.insertAdjacentElement('beforebegin', mta.msg1);
            mta.keyList.insertAdjacentElement('beforebegin', mta.msg2);

        },

        init : function() {

            mta.setupPreview();
            mta.insertMessages();
            mta.formField.addEventListener('keyup', (evt) => this.updateAd(evt), false);
            mta.formField.addEventListener('click', (evt) => this.addField(evt), false);

        },

        findTarget : function(evt, targetNode, container) {

            let currentNode = evt.target;
            while (currentNode && currentNode !== container) {
                if (currentNode.nodeName.toLowerCase() === targetNode.toLowerCase()) {
                    return currentNode;
                }
                else {
                    currentNode = currentNode.parentNode;
                }
                return false;
            }
        },

        updateAd : function(evt){

            let field = mta.findTarget(evt, 'input', evt.currentTarget) || mta.findTarget(evt, 'textarea', evt.currentTarget);

            if (!field || field.name === 'keyphrase[]') {return;}

            switch(field.id) {
            
            case 'txt' :
                
                mta.link.firstChild.nodeValue = field.value;
                break;
                
            case 't_url' :
                
                mta.title_url_flag = mta.check_url('t_url', field.value); 
                mta.title_url_flag ? field.parentNode.classList.remove('error') : field.parentNode.classList.add('error');
                mta.title_url_flag ? field.setAttribute('aria-invalid', 'false') : field.setAttribute('aria-invalid', 'true');
                mta.title_url_flag ? mta.link.setAttribute('href', field.value) : mta.link.removeAttribute('href');
                mta.setSaveBtn();
                break;
                
            case 'desc' :
                
                mta.description.firstChild.nodeValue = field.value;
                break;
                
            case 'v_url' :
        
                mta.visible_url_flag = mta.check_url('v_url', field.value);
                mta.visible_url_flag ? field.parentNode.classList.remove('error') : field.parentNode.classList.add('error');
                mta.visible_url_flag ? field.setAttribute('aria-invalid', 'false') : field.setAttribute('aria-invalid', 'true');
                mta.visible_url_flag ? mta.visible_url.firstChild.nodeValue = field.value : mta.visible_url.firstChild.nodeValue = '';
                mta.setSaveBtn();
                break;
            
            }
            
        },

        check_url : function(url_str, str) {

            const url = url_str;
            const url_len = str.length;

            // these regex's allow for multiple periods, couldn't quite figure that out
            const valid_t_url = /^http(s)?:\/\/(([\w\-])+\.)+([\w]{2,6})+$/;
            const valid_v_url = /^(([\w\-])+\.)+([\w]{2,6})+$/;

            if (url_len === 0) {
                return true;
            } else if (url === 't_url') {
                return valid_t_url.test(str);
            } else if (url === 'v_url') {
                return valid_v_url.test(str);
            }

        },

        setSaveBtn : function() {

            let both_flags_true = true;

            (mta.visible_url_flag && mta.title_url_flag) ? both_flags_true = true : both_flags_true = false;

            if (both_flags_true) {
                mta.saveBtn.removeAttribute('disabled');
            } else {
                mta.saveBtn.setAttribute('disabled', 'disabled');
            }

        },

        addField : function(evt) {

            const btn = mta.findTarget(evt, 'input', evt.currentTarget);
            if (!btn) {return;}

            const fieldCode = '<li><input type="text" aria-label="Enter keyphrase" size="30" name="keyphrase[]" /></li>';
        
            if (btn.id === 'addAnotherBtn'){
                mta.keyList.insertAdjacentHTML('beforeend', fieldCode);
                if (mta.totalKeys.length > 4) {
                    btn.classList.toggle('rem');
                }
            }
        }

    }

    mta.init();

})();
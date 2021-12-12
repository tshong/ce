
export default function bindExtension(jexcel) {

    jexcel.tabs = function(tabs, result) {
        var instances = [];
        // Create tab container
        if (! tabs.classList.contains('jexcel_tabs')) {
            tabs.innerHTML = '';
            tabs.classList.add('jexcel_tabs')
            tabs.jexcel = [];

            var div = document.createElement('div');
            var headers = tabs.appendChild(div);
            var div = document.createElement('div');
            var content = tabs.appendChild(div);
        } else {
            var headers = tabs.children[0];
            var content = tabs.children[1];
        }

        var spreadsheet = []
        var link = [];
        for (var i = 0; i < result.length; i++) {
            // Spreadsheet container
            spreadsheet[i] = document.createElement('div');
            spreadsheet[i].classList.add('jexcel_tab');
            var worksheet = jexcel(spreadsheet[i], result[i]);
            content.appendChild(spreadsheet[i]);
            instances[i] = tabs.jexcel.push(worksheet);

            // Tab link
            link[i] = document.createElement('div');
            link[i].classList.add('jexcel_tab_link');
            link[i].setAttribute('data-spreadsheet', tabs.jexcel.length-1);
            link[i].innerHTML = result[i].sheetName;
            link[i].onclick = function() {
                for (var j = 0; j < headers.children.length; j++) {
                    headers.children[j].classList.remove('selected');
                    content.children[j].style.display = 'none';
                }
                var i = this.getAttribute('data-spreadsheet');
                content.children[i].style.display = 'block';
                headers.children[i].classList.add('selected')
            }
            headers.appendChild(link[i]);
        }

        // First tab
        for (var j = 0; j < headers.children.length; j++) {
            headers.children[j].classList.remove('selected');
            content.children[j].style.display = 'none';
        }
        headers.children[headers.children.length - 1].classList.add('selected');
        content.children[headers.children.length - 1].style.display = 'block';

        return instances;
    }

}


/*
 *  @project >> Mintos Extension
 *  @version >> 1.0.0
 *  @release >> n/a
 *  @authors >> DeeNaxic
 *  @contact >> DeeNaxic@gmail.com
 */

var $dataTable      = document.querySelector('#investor-investments-table');
var $thead          = $dataTable.querySelector('thead');
var $tbody          = $dataTable.querySelector('tbody');

chrome.storage.sync.get(
{
    'InvestmentsShowProfit'     : true,
    'InvestmentsShowDuration'   : true
},
function (data)
{
    /*
     *  This creates a header cell, according to the ones used in the investment
     *  data table. It uses the same styles, and takes as input the headers text
     */
    function $createHeader (text)
    {
        var nodeOuter = document.createElement('th');
        var nodeInner = document.createElement('a');
            nodeInner.innerText = text;
            nodeOuter.appendChild(nodeInner);
            
        return nodeOuter;
    }
    
    /*
     *  This creates a new element, to use in the data table header row. This is
     *  the tooltip part of the header row. It creates both the icon and tooltip
     *  box, which appears when hovering or clicking on the icon. For styling it
     *  uses the same style classes, as the built-in ones, so it appears similar
     */
    function $createTooltip (text)
    {
        var nodeOuter = document.createElement('th');
        var nodeInner = document.createElement('i')
            nodeInner.classList.add('fas');
            nodeInner.classList.add('fa-info-circle');
            nodeInner.classList.add('tooltip-color-gray');
            nodeInner.setAttribute ('data-tooltip-trigger', 'hover,click');
            nodeInner.setAttribute ('data-theme', 'dark');
            nodeInner.setAttribute ('data-placement', 'bottom');
            nodeInner.setAttribute ('data-tooltip', text);
            nodeOuter.appendChild(nodeInner);
            
        return nodeOuter;
    }
    
    /*
     *  This will add a column with total duration to the end of each row in the
     *  data table, for finished investments. It starts by inserting the headers
     *  of the table, and then registers a DomListener. This listener trigger on
     *  both sorting and filtering actions, and if the cell already exists, then
     *  it will simply update it. If it does not, then it inserts the data cells
     */
    if (data.InvestmentsShowDuration)
    {
        $thead.querySelectorAll('tr')[0].appendChild($createHeader ('Duration'));
        $thead.querySelectorAll('tr')[1].appendChild($createTooltip('The total amount of days which you held this note.'));
        
        DomMonitor($dataTable, function (mutations)
        {
            for (var rows = $tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
            {
                var cells   = rows[i].querySelectorAll('td');
                var days    = Math.floor(Math.abs((toDate(cells[2].innerText).getTime() - toDate(cells[9].innerText).getTime()) / 86400000));
                var node    = getElementByAttribute(cells, "data-m-label", 'Duration');
                
                if (node === undefined)
                {
                    node = document.createElement('td');
                    node.setAttribute ('data-m-label', 'Duration');
                    node.classList.add('global-align-right');
                    rows[i].appendChild(node);
                }
                
                node.innerText = days + ' days';
            }
        });
    }
    
    /*
     *  This will add a column with assumed profit to the end of each row in the
     *  data table, for finished investments. It starts by inserting the headers
     *  of the table, and then registers a DomListener. This listener trigger on
     *  both sorting and filtering actions, and if the cell already exists, then
     *  it will simply update it. If it does not, then it inserts the data cells
     */
    if (data.InvestmentsShowProfit)
    {
        $thead.querySelectorAll('tr')[0].appendChild($createHeader ('Profit'));
        $thead.querySelectorAll('tr')[1].appendChild($createTooltip('The total profit made from this note, calculated as the total received payments minus the investment amount you spent on buying it.'));
        
        DomMonitor($dataTable, function (mutations)
        {
            for (var rows = $tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
            {
                var cells   = rows[i].querySelectorAll('td');
                var profit  = toFloat(cells[7].innerText) - toFloat(cells[3].innerText);
                var node    = getElementByAttribute(cells, "data-m-label", 'Profit');
                
                if (node === undefined)
                {
                    node = document.createElement('td');
                    node.setAttribute ('data-m-label', 'Profit');
                    node.classList.add('global-align-right');
                    rows[i].appendChild(node);
                }
                
                node.setAttribute('style', 'color:' + (profit > 0.00 ? 'green' : 'red') + ';');
                node.innerText = '€ ' + profit.toFixed(2);
            }
        });
    }
});
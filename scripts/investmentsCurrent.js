/*
 *  @project >> Mintos Extension
 *  @version >> 1.0.0
 *  @authors >> DeeNaxic, o1-steve
 *  @contact >> DeeNaxic@gmail.com
 */

chrome.storage.sync.get(
{
    'InvestmentsShowDaysToNextPayment'  : true,
    'InvestmentsHighlightLateLoans'     : true,
    'InvestmentsShowPremiumDiscount'    : true
},
function (data)
{
    var dataTable       = document.querySelector('#investor-investments-table');
    var thead           = dataTable.querySelector('thead');
    var tbody           = dataTable.querySelector('tbody');
    
    /*
     *  This will replace the 'next payment date' columns, so instead of showing
     *  the date of the next payment, it shows the amount of days instead. Those
     *  loans whitch are late, doesn't change. Any any loan date today, is shown
     *  as 0 days. It hides the original field, rather than replacing the values
     */
    if (data.InvestmentsShowDaysToNextPayment)
    {
        getElementByAttribute(document.querySelector('thead tr').querySelectorAll('th'), 'data-sort-field', 'next_planned_payment_date').querySelector('span').innerHTML = 'Days To<br>Next Payment';
        
        DomMonitor(dataTable, function (mutations)
        {
            for (var rows = tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
            {
                var cell  = getElementByAttribute(rows[i].querySelectorAll('td'), 'data-m-label', 'Next Payment Date');
                var time  = cell.querySelectorAll('span')[0];
                var node  = cell.querySelectorAll('span')[1];
                
                if (node == undefined)
                {
                    cell.appendChild(node = document.createElement('span'));
                    cell.classList.add('global-align-right');
                    time.style.display = 'none';
                }
                
                if (time.innerText.trim() == '-')
                {
                    node.innerText = '-';
                }
                else
                {
                    node.innerText = Math.floor((toDate(time.innerText) - new Date().setHours(0, 0, 0, 0)) / 86400000) + ' days';
                }
            }
        });
    }
    
    /*
     *  This will register a listener for the data table, and on any changes, it
     *  will go through all rows, and if the 'Term' column is 'Late'. Then it'll
     *  change the background to a slight red color, to highlight late loans. If
     *  they are not late, it sets the default white background, on each re-draw
     */
    if (data.InvestmentsHighlightLateLoans)
    {
        DomMonitor(dataTable, function (mutations)
        {
            for (var rows = tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
            {
                if (getElementByAttribute(rows[i].querySelectorAll('td'), 'data-m-label', 'Term').innerText.indexOf('Late') + 1 > 0)
                {
                    rows[i].style.background = '#d4574e22';
                }
                else
                {
                    rows[i].style.background = 'white';
                }
            }
        });
    }
    
    /*
     *  This adds a percentage counter after each note, that is for sale showing
     *  the added premium as a + number or discount as some negative number. The
     *  original number is still shown, but it becomes easier to see which notes
     *  have been set on sale with a premium / discount, no change is also shown
     */
    if (data.InvestmentsShowPremiumDiscount)
    {
        function $getPercentage (input) 
        {
            return parseFloat(/(-?\d+\.\d+)%/g.exec(input)[0]);
        }
        
        DomMonitor(dataTable, function (mutations)
        {
            for (var rows = tbody.querySelectorAll('tr'), i = 0; i < rows.length - 1; i++)
            {
                var cell    = rows[i].lastElementChild;
                var span    = cell.querySelectorAll('span')[1];
                var percent = $getPercentage(span.getAttribute('data-tooltip'));
                
                if (cell.innerText != 'Sell')
                {
                    if (span.hasAttribute('data-value') == false)
                    {
                        span.setAttribute('data-value', span.innerText);
                    }
                    
                    span.innerHTML = span.getAttribute('data-value') + ' <span style="color:' + (percent < 0.0 ? 'green' : (percent > 0.0 ? 'red' : 'black')) + ';">' + (percent < 0.0 ? ' - ' : ' + ') + Math.abs(percent).toFixed(1) + '%</span>';
                }
            }
        });
    }
});
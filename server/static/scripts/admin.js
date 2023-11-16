/**
 * @typedef {Object} ReportHeader
 * @property {number} reportVersion
 * @property {string} event
 * @property {string} trigger
 * @property {string} filename
 * @property {string} dumpEventTime
 * @property {string} dumpEventTimeStamp
 * @property {number} processId
 * @property {number} threadId
 * @property {string} cwd
 * @property {[string]} commandLine
 * @property {string} nodejsVersion
 * @property {number} wordSize
 * @property {string} arch
 * @property {string} platform
 * @property {Object} componentVersions
 * @property {{name:string,headersUrl:string,sourceUrl:string,libUrl:string}} release
 * @property {string} osName
 * @property {string} osRelease
 * @property {string} osVersion
 * @property {string} osMachine
 * @property {[{model:string,speed:number,user:number,nice:number,sys:number,idle:number,irq:number}]} cpus
 * @property {[{name:string,internal:boolean,mac:string,address:string,netmask:string,family:string,scopeid:number}]} networkInterfaces
 * @property {string} host
 * 
 * @typedef {Object} ReportJavascriptStack
 * @property {string} message
 * @property {[string]} stack
 * @property {{code:string,originalError:string,name:string}} errorProperties
 * 
 * @typedef {Object} ReportJavascriptHeapHeapSpaces
 * @property {number} memorySize
 * @property {number} committedMemory
 * @property {number} capacity
 * @property {number} used
 * @property {number} available
 * 
 * @typedef {Object} ReportJavascriptHeap
 * @property {number} totalMemory
 * @property {number} executableMemory
 * @property {number} totalCommittedMemory
 * @property {number} availableMemory
 * @property {number} totalGlobalHandlesMemory
 * @property {number} usedGlobalHandlesMemory
 * @property {number} usedMemory
 * @property {number} memoryLimit
 * @property {number} mallocedMemory
 * @property {number} externalMemory
 * @property {number} peakMallocedMemory
 * @property {number} nativeContextCount
 * @property {number} detachedContextCount
 * @property {number} doesZapGarbage
 * @property {{heapSpaces:ReportJavascriptHeapHeapSpaces,new_space:ReportJavascriptHeapHeapSpaces,old_space:ReportJavascriptHeapHeapSpaces,code_space:ReportJavascriptHeapHeapSpaces,shared_space:ReportJavascriptHeapHeapSpaces,new_large_object_space:ReportJavascriptHeapHeapSpaces,large_object_space:ReportJavascriptHeapHeapSpaces,code_large_object_space:ReportJavascriptHeapHeapSpaces,shared_large_object_space:ReportJavascriptHeapHeapSpaces}} heapSpaces
 * 
 * @typedef {[{pc:string,symbol:string}]} ReportNativeStack
 * 
 * @typedef {Object} ReportResourceUsage
 * @property {number} free_memory
 * @property {number} total_memory
 * @property {number} rss
 * @property {number} available_memory
 * @property {number} userCpuSeconds
 * @property {number} kernelCpuSeconds
 * @property {number} cpuConsumptionPercent
 * @property {number} userCpuConsumptionPercent
 * @property {number} kernelCpuConsumptionPercent
 * @property {number} maxRss
 * @property {{IORequired:number,IONotRequired:number}} pageFaults
 * @property {{reads:number,writes:number}} fsActivity
 * 
 * @typedef {Object} ErrorReport
 * @property {ReportHeader} header
 * @property {ReportJavascriptStack} javascriptStack
 * @property {ReportJavascriptHeap} javascriptHeap
 * @property {ReportNativeStack} nativeStack
 * @property {ReportResourceUsage} resourceUsage
 */

const getToken = () => document.cookie
    .split(";")
    .filter(cookie => cookie.startsWith("token"))
    ?.[0]
    ?.split("=")
    ?.[1];

if (!getToken()) document.cookie = `token=${prompt("Token")}`;

/**
 * @returns {Promise<[ErrorReport],Error>}
 */
function logs() {
    return new Promise((resolve, reject) => fetch("/logs", { headers: { token: getToken() } })
        .then(response => response
            .json()
            .then(resolve)
            .catch(reject))
        .catch(console.error));
}


logs()
    .then(reports => document.getElementById("reporting").innerHTML = reports.map(json_html).join(""))
    .catch(console.error);


function json_html(data) {
    console.log(data);
    if (Array.isArray(data)) return `<ol>${data.map(value => `<li>${json_html(value)}</li>`)}</ol>`;
    else if (typeof data === "object") return `<dl>${Object.entries(data).map(entry => `<dt>${entry[0]}</dt><dd>${json_html(entry[1])}</dd>`)}</dl>`;
    else return `${data}`;
}
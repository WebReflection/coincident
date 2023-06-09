import coincident from '../../uhtml.js';
const {uhtml, window} = coincident(self);

const {render, html} = uhtml;
const {document} = window;

const target = document.querySelector('#app');

const ENV = function () {'use strict';
  var counter = 0;
  var data;
  var _base;
  if (!(_base = String.prototype).lpad)
    _base.lpad = function (padding, toLength) {
      return padding.repeat((toLength - this.length) / padding.length).concat(this);
    };

  function formatElapsed(value) {
    var str = parseFloat(value).toFixed(2);
    if (value > 60) {
      var minutes = Math.floor(value / 60);
      var comps = (value % 60).toFixed(2).split('.');
      var seconds = comps[0].lpad('0', 2);
      var ms = comps[1];
      str = minutes + ":" + seconds + "." + ms;
    }
    return str;
  }

  function getElapsedClassName(elapsed) {
    var className = 'Query elapsed';
    if (elapsed >= 10.0) {
      className += ' warn_long';
    }
    else if (elapsed >= 1.0) {
      className += ' warn';
    }
    else {
      className += ' short';
    }
    return className;
  }

  function countClassName(queries) {
    var countClassName = "label";
    if (queries >= 20) {
      countClassName += " label-important";
    }
    else if (queries >= 10) {
      countClassName += " label-warning";
    }
    else {
      countClassName += " label-success";
    }
    return countClassName;
  }

  function updateQuery(object) {
    if (!object) {
      object = {};
    }
    var elapsed = Math.random() * 15;
    object.elapsed = elapsed;
    object.formatElapsed = formatElapsed(elapsed);
    object.elapsedClassName = getElapsedClassName(elapsed);
    object.query = "SELECT blah FROM something";
    object.waiting = Math.random() < 0.5;
    if (Math.random() < 0.2) {
      object.query = "<IDLE> in transaction";
    }
    if (Math.random() < 0.1) {
      object.query = "vacuum";
    }
    return object;
  }

  function cleanQuery(value) {
    if (value) {
      value.formatElapsed = "";
      value.elapsedClassName = "";
      value.query = "";
      value.elapsed = null;
      value.waiting = null;
    } else {
      return {
        query: "***",
        formatElapsed: "",
        elapsedClassName: ""
      };
    }
  }

  function generateRow(object, keepIdentity, counter) {
    var nbQueries = Math.floor((Math.random() * 10) + 1);
    if (!object) {
      object = {};
    }
    object.lastMutationId = counter;
    object.nbQueries = nbQueries;
    if (!object.lastSample) {
      object.lastSample = {};
    }
    if (!object.lastSample.topFiveQueries) {
      object.lastSample.topFiveQueries = [];
    }
    if (keepIdentity) {
      // for Angular optimization
      if (!object.lastSample.queries) {
        object.lastSample.queries = [];
        for (var l = 0; l < 12; l++) {
          object.lastSample.queries[l] = cleanQuery();
        }
      }
      for (var j in object.lastSample.queries) {
        var value = object.lastSample.queries[j];
        if (j <= nbQueries) {
          updateQuery(value);
        } else {
          cleanQuery(value);
        }
      }
    } else {
      object.lastSample.queries = [];
      for (var j = 0; j < 12; j++) {
        if (j < nbQueries) {
          var value = updateQuery(cleanQuery());
          object.lastSample.queries.push(value);
        } else {
          object.lastSample.queries.push(cleanQuery());
        }
      }
    }
    for (var i = 0; i < 5; i++) {
      var source = object.lastSample.queries[i];
      object.lastSample.topFiveQueries[i] = source;
    }
    object.lastSample.nbQueries = nbQueries;
    object.lastSample.countClassName = countClassName(nbQueries);
    return object;
  }

  function getData(keepIdentity) {
    var oldData = data;
    if (!keepIdentity) { // reset for each tick when !keepIdentity
      data = [];
      for (var i = 1; i <= ENV.rows; i++) {
        data.push({ dbname: 'cluster' + i, query: "", formatElapsed: "", elapsedClassName: "" });
        data.push({ dbname: 'cluster' + i + ' slave', query: "", formatElapsed: "", elapsedClassName: "" });
      }
    }
    if (!data) { // first init when keepIdentity
      data = [];
      for (var i = 1; i <= ENV.rows; i++) {
        data.push({ dbname: 'cluster' + i });
        data.push({ dbname: 'cluster' + i + ' slave' });
      }
      oldData = data;
    }
    for (var i in data) {
      var row = data[i];
      if (!keepIdentity && oldData && oldData[i]) {
        row.lastSample = oldData[i].lastSample;
      }
      if (!row.lastSample || Math.random() < ENV.mutations()) {
        counter = counter + 1;
        if (!keepIdentity) {
          row.lastSample = null;
        }
        generateRow(row, keepIdentity, counter);
      } else {
        data[i] = oldData[i];
      }
    }
    return {
      toArray: function () {
        return data;
      }
    };
  }

  var mutationsValue = 0.1;

  function mutations(value) {
    if (value) {
      mutationsValue = value;
      return mutationsValue;
    } else {
      return mutationsValue;
    }
  }

  var body = document.querySelector('body');
  var theFirstChild = body.firstChild;

  var sliderContainer = document.createElement('div');
  sliderContainer.style.cssText = "display: flex";
  var slider = document.createElement('input');
  var text = document.createElement('label');
  text.innerHTML = 'mutations : ' + (mutationsValue * 100).toFixed(0) + '%';
  text.id = "ratioval";
  slider.setAttribute("type", "range");
  slider.style.cssText = 'margin-bottom: 10px; margin-top: 5px';
  slider.addEventListener('change', function (e) {
    ENV.mutations(e.target.value / 100);
    document.querySelector('#ratioval').innerHTML = 'mutations : ' + (ENV.mutations() * 100).toFixed(0) + '%';
  });
  sliderContainer.appendChild(text);
  sliderContainer.appendChild(slider);
  body.insertBefore(sliderContainer, theFirstChild);

  return {
    generateData: getData,
    rows: 50,
    timeout: 0,
    mutations: mutations
  };
}();

function updateTable(dbs) {
  render(target, html`
  <table class="table table-striped latest-data">
    <tbody>${dbs.map((db, i) => html`
      <tr key="${db.dbname}">${[
        html`<td class="dbname">${db.dbname}</td>`,
        html`
        <td class="query-count">
          <span class="${db.lastSample.countClassName}">
            ${db.lastSample.nbQueries}
          </span>
        </td>`
      ].concat(db.lastSample.topFiveQueries.map((query, j, a) =>
        html`
        <td class="${query.elapsedClassName}">
          <span class="foo">
            ${query.formatElapsed}
          </span>
          <div class="popover left">
            <div class="popover-content">
              ${query.query}
            </div>
            <div class="arrow"></div>
          </div>
        </td>`
        ))
      }</tr>`
    )}</tbody>
  </table>`);
}

updateTable(ENV.generateData().toArray());

const perfMonitor = {
  endProfile: function () {},
  initProfiler: function () {},
  startFPSMonitor: function () {},
  startMemMonitor: function () {},
  startProfile: function () {}
};
perfMonitor.startFPSMonitor();
perfMonitor.startMemMonitor();
// perfMonitor.initProfiler('data update');
perfMonitor.initProfiler('view update');

function update() {
  // perfMonitor.startProfile('data update');
  var data = ENV.generateData().toArray();
  // perfMonitor.endProfile('data update');
  perfMonitor.startProfile('view update');
  updateTable(data);
  perfMonitor.endProfile('view update');
  setTimeout(update, ENV.timeout);
}

update();

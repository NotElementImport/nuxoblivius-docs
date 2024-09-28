import {
  __publicField,
  isReactive,
  isRef,
  reactive,
  watch
} from "./chunk-NZOKY2LQ.js";

// node_modules/nuxoblivius/dist/ts/Utils.js
function toRefRaw(object) {
  const raw = object.value ?? void 0;
  if (typeof raw === "undefined")
    throw new Error("raw is empty");
  const proto = Object.getPrototypeOf(raw);
  proto.raw = () => object;
  return raw;
}
async function resolveOrLater(data, callback) {
  if (data instanceof Promise)
    return data.then((value) => {
      callback(value);
    });
  callback(data);
}
function refOrVar(value) {
  if (!value)
    return value;
  if (typeof value == "function") {
    value = value();
  }
  if (value == null) {
    return null;
  }
  if (isRef2(value) || isRef(value) || (value == null ? void 0 : value.__v_isRef)) {
    return value.value;
  }
  return value;
}
function isRef2(value) {
  return typeof value == "object" && "_module_" in value;
}
function storeToQuery(object) {
  const unpacked = object.value;
  if (typeof unpacked != "object") {
    return {};
  }
  const result = {};
  for (const [name] of Object.entries(unpacked)) {
    if (name.length == 0)
      continue;
    if (name[0] != "_") {
      const value = unpacked[name];
      result[name] = value;
    }
  }
  for (const [name, _] of Object.entries(Object.getOwnPropertyDescriptors(unpacked))) {
    if (name.length == 0)
      continue;
    if (name[0] != "_") {
      const value = unpacked[name];
      if (typeof value != "undefined" && typeof value != "object" && typeof value != "function") {
        if (value != null) {
          result[name] = value;
        }
      }
    }
  }
  return result;
}
function urlPathParams(url, params) {
  Object.entries(params).map(([param, value]) => {
    value = value ?? "";
    url = url.replaceAll(`{${param}}`, typeof value !== "number" ? value ? value : "" : value);
  });
  return url;
}
function queryToUrl(query) {
  let flatObject = {};
  const flat = (objectToFlat, prefix = "", suffix = "") => Object.entries(objectToFlat).map(([name, value]) => typeof value == "object" && (!isRef2(value) && !isRef(value)) ? flat(value, `${prefix + name + suffix}[`, "]") : flatObject[`${prefix + name + suffix}`] = refOrVar(value));
  flat(query);
  if (Object.keys(flatObject).length == 0)
    return ``;
  return `?${new URLSearchParams(flatObject).toString()}`;
}
function appendMerge(...objects) {
  const result = {};
  const recursive = (value, to) => {
    for (const [nameRec, valueRec] of Object.entries(value)) {
      if (valueRec == null)
        continue;
      if (typeof valueRec == "object" && !isRef2(valueRec) && !isRef(valueRec) && !isReactive(valueRec)) {
        if (!(nameRec in to))
          to[nameRec] = {};
        recursive(to[nameRec], valueRec);
      } else {
        to[nameRec] = valueRec;
      }
    }
  };
  for (const local of objects) {
    recursive(local, result);
  }
  return result;
}

// node_modules/nuxoblivius/dist/ts/config.js
var defaultHeaders = {};
var defaultFetchFailure = () => void 0;
var options = {
  /**
   * HTTP request configuration
   */
  http: async (url, options2, isblob) => {
    let response = await fetch(url, options2);
    let _meta = {
      ok: response.ok,
      code: response.status,
      text: response.statusText
    };
    if (!response.ok) {
      return {
        _meta,
        header: response.headers,
        body: {
          _errorCode: response.status,
          _errorText: response.statusText,
          _errorBody: await response.text()
        }
      };
    }
    if (isblob)
      return { header: response.headers, body: response.blob(), _meta };
    const raw = await response.text();
    if (raw.length > 0 && (raw[0] == "{" || raw[0] == "[")) {
      return { header: response.headers, body: JSON.parse(raw), _meta };
    }
    return { header: response.headers, body: raw, _meta };
  },
  cookie: { get: (name) => "", set: (name, value) => null },
  router: {},
  _templates: {},
  // incapsulated templates
  get templates() {
    return this._templates;
  }
};
function setRequestFailure(handle) {
  defaultFetchFailure = handle;
}
function setDefaultHeader(name, value) {
  defaultHeaders[name] = value;
}
function setDefaultAuth(string) {
  defaultHeaders.Authorization = string;
}
function callPattern(name, data) {
  if (typeof name == "string" && name in options.templates) {
    return options.templates[name](data);
  } else if (typeof name == "function") {
    return name(data);
  }
  return { data };
}
function extendsPattern(parent, child) {
  if ("data" in child) {
    parent.data = child.data;
  }
  if ("pageCount" in child) {
    parent.pageCount = child.pageCount;
  }
  if ("protocol" in child) {
    parent.protocol = child.protocol;
  }
  return parent;
}
function isValidPattern(pattern) {
  if (typeof pattern === "string" && pattern.length > 0)
    return true;
  else if (typeof pattern === "function")
    return true;
  else
    return false;
}
async function storeFetch(url, requestInit, isblob, pattern) {
  const response = await options.http(url, requestInit, isblob);
  if (response instanceof Blob) {
    return {
      header: response.header,
      data: response.body,
      error: false,
      code: 200,
      errorText: "",
      pageCount: 0,
      protocol: null
    };
  }
  if (typeof response.body == "object" && !Array.isArray(response.body) && "_errorCode" in response.body) {
    if (response.body._errorBody.length > 0 && response.body._errorBody[0] == "{") {
      response.body._errorBody = JSON.parse(response.body._errorBody);
    }
    return {
      header: response.header,
      data: response.body._errorBody || null,
      error: true,
      code: response.body._errorCode || 500,
      errorText: response.body._errorText || "Unknow",
      pageCount: 0,
      protocol: null
    };
  }
  let data = response.body;
  let pageCount = 0;
  let protocol = null;
  if (isValidPattern(pattern)) {
    const result = callPattern(pattern, response.body) || {};
    data = result.data ?? data;
    pageCount = result.pageCount ?? pageCount;
    protocol = result.protocol ?? protocol;
  }
  return {
    header: response.header,
    data,
    code: 200,
    error: false,
    pageCount,
    errorText: "",
    protocol
  };
}
var settings = {
  template(name, logic) {
    options.templates[name] = logic;
    return this;
  },
  httpClient(client) {
    options.http = client;
    return this;
  },
  cookieWorker(logic) {
    options.cookie = logic;
    return this;
  },
  router(logic) {
    options.router = logic;
    return this;
  }
};

// node_modules/nuxoblivius/dist/ts/Record.js
var ETagPlace;
(function(ETagPlace2) {
  ETagPlace2[ETagPlace2["PATH"] = 0] = "PATH";
  ETagPlace2[ETagPlace2["QUERY"] = 1] = "QUERY";
})(ETagPlace || (ETagPlace = {}));
var EParamsTagsType;
(function(EParamsTagsType2) {
  EParamsTagsType2[EParamsTagsType2["SIMPLE"] = 0] = "SIMPLE";
  EParamsTagsType2[EParamsTagsType2["FULL"] = 1] = "FULL";
})(EParamsTagsType || (EParamsTagsType = {}));
var ESwapMethod;
(function(ESwapMethod2) {
  ESwapMethod2[ESwapMethod2["HOT"] = 0] = "HOT";
  ESwapMethod2[ESwapMethod2["LAZY"] = 1] = "LAZY";
  ESwapMethod2[ESwapMethod2["GREEDY"] = 2] = "GREEDY";
  ESwapMethod2[ESwapMethod2["PAGINATION"] = 3] = "PAGINATION";
})(ESwapMethod || (ESwapMethod = {}));
var isClient = typeof document !== "undefined";
var MarkSetup = Symbol("Record Setup");
var isSetup = (value) => typeof value === "object" && value[MarkSetup];
var createRequest = () => {
  let [resolve, reject] = [(data) => {
  }, () => {
  }];
  const request = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { request, resolve, reject };
};
var Record = class _Record {
  constructor() {
    // Details
    /** Redirect to current request if on action */
    __publicField(this, "_oneRequestAtTime", false);
    /** Object of current Request (Promise object when return a response) */
    __publicField(this, "_currentRequest", null);
    // Fetch settings
    /** Pathname for fetching  */
    __publicField(this, "_url", "");
    /** @deprecated Other Stores as Query object */
    __publicField(this, "_queryStore", null);
    /** Query for fetching */
    __publicField(this, "_query", {});
    /** Baked Query for fetching [cannot be removed] */
    __publicField(this, "_staticQuery", {});
    /** Path params for query */
    __publicField(this, "_pathParams", {});
    /** Headers for query */
    __publicField(this, "_headers", {});
    /** Body request for query */
    __publicField(this, "_body", null);
    /** Authorization for query */
    __publicField(this, "_auth", null);
    /** Always use body */
    __publicField(this, "_forceBody", false);
    /** Response type is blob */
    __publicField(this, "_isBlob", false);
    /** Current `pattern response reader` */
    __publicField(this, "_template", "");
    // Cachin / Tags
    __publicField(this, "_tags", { "id": ETagPlace.PATH });
    __publicField(this, "_tagsType", { "id": EParamsTagsType.SIMPLE });
    __publicField(this, "_lastRequestTags", {});
    // Pre Fetch config
    /** Receive data only when the response is empty */
    __publicField(this, "_onNullCheck", false);
    /** [For nerds] When to delete data in response  */
    __publicField(this, "_swapMethod", ESwapMethod.HOT);
    // Post Fetch config
    /** Data from `pattern response reader` */
    __publicField(this, "_protocol", {});
    /** Rebuild the object at the specified rule */
    __publicField(this, "_recordRuleBehaviour", []);
    /** Default settings if no rule is suitable  */
    __publicField(this, "_defaultRule", () => null);
    // Event Handlers:
    /** Error Handler */
    __publicField(this, "_onError", null);
    /** Finish Response Handler */
    __publicField(this, "_onEnd", null);
    // Links
    /** For re-launching fetch */
    __publicField(this, "_lastStep", () => new Promise((resolve) => resolve(null)));
    /** Proxy object for getting multiple data, uses in param.query */
    __publicField(this, "_proxies", {});
    /** Registered borrows logic */
    __publicField(this, "_borrow", /* @__PURE__ */ new Map());
    __publicField(this, "_borrowAnother", /* @__PURE__ */ new Map());
    __publicField(this, "_enabledBorrow", true);
    /** Old Response / Cached Data */
    __publicField(this, "_allCachedResponse", /* @__PURE__ */ new Map());
    __publicField(this, "_paginationEnabled", false);
    __publicField(this, "_pagination", {
      change: false,
      where: "path",
      param: "page"
    });
    /** Vue Reactive Variables */
    __publicField(this, "_variables", reactive({
      currentPage: 1,
      // Pagination.current
      maxPages: 1,
      // Pagination.lastPage
      autoReloadPagination: false,
      // Reload data after change page
      expandResponse: false,
      // Appends response to end
      isLastPage: false,
      // Is last page
      response: null,
      // Reactive Response Object
      headers: {},
      // Response headers
      error: "",
      // status text
      frozenKey: 0,
      /** @deprecated [Nerd] :key variable, for manual watch effect */
      isError: false,
      isLoading: false
    }));
    /** @deprecated [Nerd] Frozen Response for manual trigger WatchEffect */
    __publicField(this, "_frozenResponse", null);
  }
  // Property 
  /** @deprecated useless */
  get frozenResponse() {
    return this._frozenResponse;
  }
  /** @deprecated useless */
  get frozenKey() {
    return this._variables.frozenKey;
  }
  /**
   * Get response
   */
  get response() {
    return this._variables.response;
  }
  /**
   * Set response
   */
  set response(value) {
    this._variables.response = value;
  }
  /**
   * Get response Headers
   */
  get headers() {
    return this._variables.headers;
  }
  /**
   * [Module] Pagination
   *
   */
  get pagination() {
    const pThis = this;
    return {
      setup(how, enabledByDefault = true) {
        this.enabled = enabledByDefault;
        if (how.startsWith("query:")) {
          pThis._pagination.where = "query";
          pThis._pagination.param = how.slice(6);
        } else if (how.startsWith("path:")) {
          pThis._pagination.where = "path";
          pThis._pagination.param = how.slice(5);
        }
        pThis._swapMethod = ESwapMethod.PAGINATION;
        return pThis;
      },
      autoReload(value = true) {
        pThis._variables.autoReloadPagination = value;
        return pThis;
      },
      set enabled(v) {
        pThis._paginationEnabled = v;
      },
      toFirst() {
        if (pThis._variables.currentPage == 1)
          return pThis;
        pThis._variables.currentPage = 1;
        pThis._variables.isLastPage = pThis._variables.maxPages == pThis._variables.currentPage;
        if (pThis._variables.autoReloadPagination)
          pThis._lastStep();
        return pThis;
      },
      toLast() {
        if (pThis._variables.currentPage == pThis._variables.maxPages)
          return pThis;
        pThis._variables.currentPage = pThis._variables.maxPages;
        pThis._variables.isLastPage = pThis._variables.maxPages == pThis._variables.currentPage;
        pThis._pagination.change = true;
        if (pThis._variables.autoReloadPagination)
          pThis._lastStep();
        return pThis;
      },
      next() {
        if (pThis._variables.maxPages > pThis._variables.currentPage) {
          pThis._variables.currentPage += 1;
          pThis._variables.isLastPage = pThis._variables.maxPages == pThis._variables.currentPage;
          pThis._pagination.change = true;
          if (pThis._variables.autoReloadPagination)
            pThis._lastStep();
        }
        return pThis;
      },
      prev() {
        if (pThis._variables.currentPage > 1) {
          pThis._variables.currentPage -= 1;
          pThis._variables.isLastPage = pThis._variables.maxPages == pThis._variables.currentPage;
          pThis._pagination.change = true;
          if (pThis._variables.autoReloadPagination)
            pThis._lastStep();
        }
        return pThis;
      },
      get isLastPage() {
        return pThis._variables.isLastPage;
      },
      set current(v) {
        pThis._variables.currentPage = v;
        pThis._pagination.change = true;
        if (pThis._variables.autoReloadPagination)
          pThis._lastStep();
      },
      get current() {
        return pThis._variables.currentPage;
      },
      get lastPage() {
        return pThis._variables.maxPages;
      }
    };
  }
  /**
   * Get Path Param and Query, values
   */
  get params() {
    const pthis = this;
    return {
      get path() {
        return pthis._pathParams;
      },
      get query() {
        return pthis._proxies.query;
      }
    };
  }
  /**
   * other data from `pattern response reader`, define with `defineProtocol`
   */
  get protocol() {
    return this._protocol;
  }
  /**
   * Is fetching data
   */
  get loading() {
    return this._variables.isLoading;
  }
  /**
   * If catch error
   */
  get error() {
    return this._variables.isError;
  }
  /**
   * If catch error set errorText
   */
  get errorText() {
    return this._variables.error;
  }
  // Creating
  static new(url, defaultValue) {
    const instance = new _Record();
    instance._url = url;
    instance._variables.response = defaultValue ?? null;
    instance._proxies.query = new Proxy({}, {
      get(t, p, r) {
        if (p in instance._query)
          return refOrVar(instance._query[p]);
        else if (p in instance._staticQuery)
          return refOrVar(instance._staticQuery[p]);
        return void 0;
      }
    });
    return instance;
  }
  // Sugar
  /**
   * [Sugar] Change d.ts type from array to item
   */
  get one() {
    return this._variables.response;
  }
  /**
   * [Sugar] Change d.ts type from item to array
   */
  get many() {
    return this._variables.response;
  }
  /**
  * [Sugar] Creating Bearer auth string
  */
  static Bearer(token) {
    return `Bearer ${token}`;
  }
  /**
  * [Sugar] Creating Basic auth string
  */
  static Basic(login, password) {
    return `Basic ${btoa(login + ":" + password)}`;
  }
  /**
   * [Sugar] body json
   */
  static json(item) {
    return {
      [MarkSetup]: true,
      headers: { "Content-Type": "application/json" },
      body: () => JSON.stringify(refOrVar(item))
    };
  }
  /**
   * [Sugar] body urlEncoded
   */
  static urlEncoded(item) {
    return {
      [MarkSetup]: true,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: () => {
        const raw = refOrVar(item);
        return queryToUrl(raw);
      }
    };
  }
  // Configuration
  // Custom presets
  preset(object) {
    if (typeof object === "function") {
      object(this);
      return this;
    }
    if ("body" in object)
      this.body(object.body);
    if ("appendsResponse" in object)
      this.appendsResponse(object.appendsResponse);
    if ("onlyOnEmpty" in object)
      this.onlyOnEmpty(object.onlyOnEmpty);
    if ("oneRequestAtTime" in object)
      this.oneRequestAtTime(object.oneRequestAtTime);
    if (object.headers) {
      for (const [name, value] of Object.entries(object.headers))
        this.header(name, value);
    }
    if (object.rule) {
      for (const [condition, apply] of object.rule)
        this.rule(condition, apply);
    }
    if (object.borrow) {
      for (const [condition, from, research] of object.borrow)
        this.borrowFrom(condition, from, research);
    }
    if (object.defaultRule)
      this.defaultRule(object.defaultRule);
    if (object.query)
      this.query(object.query);
    if (object.swapMethod)
      this.swapMethod(object.swapMethod);
    if (object.pagination) {
      const [name, enabled, autoReload] = object.pagination;
      this.pagination.setup(name, enabled);
      this.pagination.autoReload(autoReload);
    }
    if (object.pathParams) {
      for (const [name, value] of Object.entries(object.pathParams))
        this.pathParam(name, value);
    }
    return this;
  }
  /**
  * [Configuration]
  * [Nerds] Creating Tag for processing: `borrow`, `caching`, `rules`
  *
  * simple - check has value or not
  * full   - can access to value
  */
  createTag(field, access = "simple") {
    const acecssValue = access == "simple" ? EParamsTagsType.SIMPLE : EParamsTagsType.FULL;
    if (field.startsWith("query:")) {
      const name = field.slice(6);
      this._tags[name] = ETagPlace.QUERY;
      this._tagsType[name] = acecssValue;
    } else if (field.startsWith("path:")) {
      const name = field.slice(5);
      this._tags[name] = ETagPlace.PATH;
      this._tagsType[name] = acecssValue;
    }
    return this;
  }
  /**
   * [Configuration]
   * Redirect request to current Request if launched
   */
  oneRequestAtTime(value = true) {
    this._oneRequestAtTime = value;
    return this;
  }
  /**
   * [Configuration]
   * Appends new response to current response like\
   * `response.push(...new_response)`
   *
   * ! If enable disabled swapMethod [Nerd thing]
   */
  appendsResponse(value = true) {
    if (isClient)
      this._variables.expandResponse = value;
    return this;
  }
  /**
   * [Configuration]
   * Only do Fetch if response == null
   */
  onlyOnEmpty(enabled = true) {
    if (isClient)
      this._onNullCheck = enabled;
    return this;
  }
  /**
   * [Configuration]
   * Create rule on specific behaviour
   *
   * Example:\
   * `Our url: /api/my-stuff?page=1`
   *
   * Create rule for `page` has some value
   *
   * ```ts
   * .createTag('query:page', 'simple') // Creating tag to checking behaviour, and get simple access
   * .rule(
   *    { 'page': '*' }, // Search by tag: Query param `page` has any value
   *    record => record
   *      .template('my-template-pagination') // We use template for Pagination type response
   * )
   * .defaultRule(
   *    record => record
   *      .template('') // Else disable template
   * )
   * ```
   */
  rule(rule, behaviour) {
    const check = (recordTag) => {
      return typeof rule == "function" ? rule(this.params) : _Record.compareTags(rule, recordTag, this._lastRequestTags);
    };
    this._recordRuleBehaviour.push((recordTag) => {
      if (!check(recordTag))
        return false;
      behaviour(this);
      return true;
    });
    return this;
  }
  /**
   * [Configuration]
   * Deafult rule if other rules not valid
   *
   * Check `rule` method for example
   */
  defaultRule(behaviour) {
    this._defaultRule = () => behaviour(this);
    return this;
  }
  /**
   * [Configuration]
   * Rewrite url, using in `rule` and `defaultRule` section
   */
  url(path) {
    this._url = path;
    return this;
  }
  /**
   * [Configuration]
   * Enable / Disable logic for `borrowAtAnother` and `borrowAtSelf`
   */
  enableBorrow(value) {
    this._enabledBorrow = value;
    return this;
  }
  /**
   * [Configuration]
   * Rollback to cached data, using in `rule` and `defaultRule` section
   * Condition example:
   *  { id: '*' } // get old response data where: id sets
   *  { id: null } // get old response data where: id not sets
   */
  prepare(condition, behaviour = () => true) {
    let data = this.cached(condition);
    if (!behaviour())
      return this;
    if (data != null) {
      this.setResponse(data);
      this._variables.currentPage = 1;
      this._variables.isLastPage = this._variables.currentPage == this._variables.maxPages;
    } else {
      console.warn("prepare is empty");
    }
    return this;
  }
  /**
   * [Configuration]
   * [Nerds] When to delete data in response
   *
   * `hot`    - Seamless loading
   * `lazy`   - After checking borrow algorithm, delete current data
   * `greedy` - Immediately delete current data from start fetching
   */
  swapMethod(method) {
    if (method == "hot")
      this._swapMethod = ESwapMethod.HOT;
    else if (method == "greedy")
      this._swapMethod = ESwapMethod.GREEDY;
    else if (method == "lazy")
      this._swapMethod = ESwapMethod.LAZY;
    else if (method == "pagination")
      this._swapMethod = ESwapMethod.PAGINATION;
    return this;
  }
  /**
   * [Configuration]
   * [Nerds] Get data from another object, instead of fetching. Otherwise do fetching
   *
   * @param condition Check whether the conditions are suitable for the execution of the "borrow". (By tags or Functioin)
   * @param another   The object we're going to take from
   * @param as        Logic for finding what you need in an object
   */
  borrowFrom(condition, another, as) {
    if (!isClient)
      return this;
    this._borrowAnother.set(condition, (_) => {
      const object = refOrVar(another);
      if (!Array.isArray(object)) {
        console.warn("borrow, from value is not array");
        return null;
      }
      for (const part of object) {
        const result = as(part);
        if (typeof result != "undefined" && result != null) {
          return result;
        }
      }
      return null;
    });
    return this;
  }
  /**
   * [Configuration]
   * [Nerds] Get data from self, by caching value, instead of fetching. Otherwise do fetching
   *
   * @param condition Check whether the conditions are suitable for the execution of the "borrow". (By tags or Functioin)
   * @param from      Get caching data by tags. Otherwise skip "borrow"
   * @param as        Logic for finding what you need in an object
   */
  borrowAtSelf(where, from, as) {
    if (!isClient)
      return this;
    this._borrow.set(where, [from, (response) => {
      if (!Array.isArray(response)) {
        console.warn("{value} is not array");
        return null;
      }
      for (const part of response) {
        const result = as(part);
        if (typeof result != "undefined" && result != null) {
          return result;
        }
      }
      return null;
    }]);
    return this;
  }
  /**
   * [Configuration]
   * `pattern response reader` using for customize raw response
   * Like:
   * { "items": [ ...someStuff ] }
   * we taking "items" from response, and final result fetch is
   * [ ...someStuff ]
   *
   * More in: https://notelementimport.github.io/nuxoblivius-docs/release/template.html
   */
  template(template) {
    this._template = template;
    return this;
  }
  /**
   * [Configuration]
   * Set path-param value in Pathname `this._url`
   */
  pathParam(name, value) {
    resolveOrLater(value, (result) => {
      this._pathParams[name] = result;
    });
    return this;
  }
  /**
   * [Configuration]
   * Set query, for request
   * Has baked mode, a.k.a by default. This values cannot be delete by `clearDynamicQuery()`
   */
  query(query, baked = false) {
    if (isRef2(query)) {
      this._queryStore = query;
      return this;
    }
    if (baked) {
      this._staticQuery = query;
    } else {
      if (isReactive(query))
        this._query = query;
      else
        this._query = appendMerge(this._query, query);
    }
    return this;
  }
  /**
   * [Configuration]
   * `pattern response reader` protocol - other data from raw response
   * Craete default value if not setting
  */
  defineProtocol(key, defaultValue = null) {
    this._protocol[key] = defaultValue;
    return this;
  }
  /**
   * [Configuration]
   * Header of request
  */
  header(name, value) {
    resolveOrLater(value, (result) => {
      this._headers[name] = result;
    });
    return this;
  }
  /**
   * [Configuration]
   * Body of request
   * And enabling force mode for body
  */
  body(body) {
    if (isSetup(body)) {
      this.preset(body);
      return this;
    }
    resolveOrLater(body, (result) => {
      this._body = result;
      this._forceBody = result != null;
    });
    return this;
  }
  /**
   * [Configuration]
   * Watch Refs and call reload data after changing Refs
   */
  reloadBy(object) {
    if (!isClient)
      return this;
    const pThis = this;
    resolveOrLater(object, (result) => {
      if (isReactive(result) || isRef2(result) || (result == null ? void 0 : result.__v_isRef)) {
        watch(result, () => {
          const oldValueOnNullCheck = pThis._onNullCheck;
          const oldValueExpandCheck = pThis._variables.expandResponse;
          pThis._onNullCheck = false;
          pThis._variables.expandResponse = false;
          pThis.pagination.toFirst();
          pThis._lastStep().then(() => {
            pThis._onNullCheck = oldValueOnNullCheck;
            pThis._variables.expandResponse = oldValueExpandCheck;
          });
        });
        return;
      } else {
        if (!("_module_" in result))
          throw `reloadBy: only ref support`;
        result.watch(() => {
          const oldValueOnNullCheck = pThis._onNullCheck;
          const oldValueExpandCheck = pThis._variables.expandResponse;
          pThis._onNullCheck = false;
          pThis._variables.expandResponse = false;
          pThis.pagination.toFirst();
          pThis._lastStep().then(() => {
            pThis._onNullCheck = oldValueOnNullCheck;
            pThis._variables.expandResponse = oldValueExpandCheck;
          });
        });
      }
    });
    return this;
  }
  /**
   * [Configuration]
   * Authorization for request
   */
  auth(data) {
    resolveOrLater(data, (result) => {
      this._auth = result;
    });
    return this;
  }
  /**
   * [Configuration]
   * Change Response type to Blob
   */
  isBlob(value = true) {
    this._isBlob = value;
    return this;
  }
  /**
   * [Configuration]
   * Clearing queries, baked not touched
   */
  clearDynamicQuery() {
    this._query = {};
    return this;
  }
  /**
   * [Configuration]
   * On failure handle, can restart fetch
   */
  onFailure(method) {
    this._onError = method;
    return this;
  }
  /**
   * [Configuration]
   * Simple handle tracking of end fetch new data
   */
  onFinish(method) {
    this._onEnd = method;
    return this;
  }
  // Utils
  /**
   * Extends link of Method
   */
  then(handle) {
    handle();
    return this;
  }
  /**
   * Clearing Response
   */
  clearResponse() {
    this._variables.response = null;
    return this;
  }
  /**
   * Reset specific data
   */
  reset(config = { pagination: true, response: true, query: true }) {
    if (config.pagination) {
      this._variables.currentPage = 1;
    }
    if (config.response) {
      if (typeof config.response === "boolean")
        this.clearResponse();
      else if (typeof config.response === "object")
        this._variables.response = config.response;
    }
    if (config.query) {
      this.clearDynamicQuery();
    }
  }
  /**
   * Get old response by tag
   *
   * Example
   * ```ts
   * .createTag('path:id', 'full')
   * .cached({ 'id': 2 }) // Getting response where path param id is 2
   * ```
   */
  cached(rule, defaultIsnt = null) {
    for (const [descriptor, value] of this._allCachedResponse.entries()) {
      if (_Record.compareTags(rule, descriptor)) {
        return value;
      }
    }
    return defaultIsnt;
  }
  /**
   * Delete cache by tag
   *
   * @deprecated not needed, while
   */
  deleteCached(condition) {
  }
  /**
   * Not using
   * @deprecated
   */
  frozenTick() {
    this._variables.frozenKey += 1;
    return this;
  }
  // Request
  /**
   * Start request with GET method
   * @param id setting path-param id
   */
  async get(id = null) {
    this.swapGreedy();
    if (!this._forceBody)
      this._body = null;
    this.pathParam("id", id);
    this._lastStep = () => this.get(id);
    return this.doFetch("get");
  }
  /**
   * Start request with POST method
   * @param body setting body (can be ignored)
   */
  async post(body = null) {
    if (this._onNullCheck && this._variables.response != null) {
      return this._variables.response;
    }
    this.swapGreedy();
    if (!this._forceBody)
      this._body = body;
    this._lastStep = () => this.post(body);
    return this.doFetch("post");
  }
  /**
   * Start request with PUT method
   * @param body setting body (can be ignored)
   */
  async put(body = null) {
    this.swapGreedy();
    if (!this._forceBody)
      this._body = body;
    this._lastStep = () => this.put(body);
    return this.doFetch("put");
  }
  /**
   * Start request with DELETE method
   * @param id setting path-param id
   */
  async delete(id = null) {
    this.swapGreedy();
    if (!this._forceBody)
      this._body = null;
    this.pathParam("id", id);
    this._lastStep = () => this.delete(id);
    return this.doFetch("delete");
  }
  /**
   * Start request with PATCH method
   * @param id setting path-param id
   */
  async patch(id = null) {
    this.swapGreedy();
    if (!this._forceBody)
      this._body = null;
    this.pathParam("id", id);
    this._lastStep = () => this.patch(id);
    return this.doFetch("patch");
  }
  // Private Methods :
  /**
   * Getting from other object_data if suitable
   */
  borrowingFromAnother(condition) {
    if (!this._enabledBorrow)
      return null;
    const checkCondition = (condition2, other) => {
      return typeof other === "function" ? other(this.params) : _Record.compareTags(other, condition2, this._lastRequestTags);
    };
    if (this._borrowAnother.size > 0) {
      for (const [rule, searching] of this._borrowAnother.entries()) {
        if (!checkCondition(condition, rule) || !this._enabledBorrow)
          continue;
        const result = searching(null);
        if (result)
          return result;
      }
    }
    if (this._borrow.size > 0) {
      for (const [rule, options2] of this._borrow.entries()) {
        if (!checkCondition(condition, rule) || !this._enabledBorrow)
          continue;
        const [cacheCondition, searching] = options2;
        let cached = this.cached(cacheCondition);
        if (!cached)
          break;
        const result = searching(cached);
        if (result)
          return result;
      }
    }
    return null;
  }
  /**
   * Collect all queries into one
   */
  compileQuery() {
    const queryObject = this._queryStore != null ? storeToQuery(this._queryStore) : {};
    return appendMerge(queryObject, this._staticQuery, this._query, this.compilePagination());
  }
  /**
   * Creating pagination, or setup path-param
   */
  compilePagination() {
    if (!this._paginationEnabled)
      return {};
    if (this._pagination.where == "path") {
      this.pathParam(this._pagination.param, this._variables.currentPage);
      return {};
    } else if (this._pagination.where == "query") {
      return {
        [this._pagination.param]: this._variables.currentPage
      };
    }
  }
  /**
   * Try resolve condition to custom setup or use default setup
   */
  proccesRules(condition) {
    if (this._recordRuleBehaviour.length == 0)
      return;
    for (const rule of this._recordRuleBehaviour) {
      if (rule(condition))
        return;
    }
    this._defaultRule();
  }
  /**
   * Generate tag object from Path param, and Queries
   *
   * Look `createTag()` for understand code
   */
  recordDataTag(compiledQuery) {
    const tag = {};
    for (const [paramName, type] of Object.entries(this._tags)) {
      const access = this._tagsType[paramName];
      const value = type == ETagPlace.PATH ? refOrVar(this._pathParams[paramName]) : refOrVar(compiledQuery[paramName]);
      if (access == EParamsTagsType.FULL)
        tag[paramName] = value ?? null;
      else
        tag[paramName] = value ? "*" : null;
    }
    return tag;
  }
  /**
   * Call request
   */
  async doFetch(method = "get") {
    if (this._oneRequestAtTime && this._currentRequest != null) {
      return this._currentRequest;
    }
    const { request, resolve } = createRequest();
    this._currentRequest = request;
    const endRequest = (value) => {
      this._currentRequest = null;
      resolve(value);
    };
    this._variables.isLoading = true;
    const pageChange = this._pagination.change;
    this._pagination.change = false;
    let recordTag = this.recordDataTag(this.compileQuery());
    this.proccesRules(recordTag);
    recordTag = this.recordDataTag(this.compileQuery());
    this._lastRequestTags = recordTag;
    let queries = this.compileQuery();
    if (this._onNullCheck) {
      const response = this._variables.response;
      const isEmpty = response == null || typeof response == "object" && Object.keys(response ?? []).length == 0 || this._swapMethod == ESwapMethod.PAGINATION && pageChange;
      if (!isEmpty) {
        this._variables.isLoading = false;
        endRequest(response);
        return response;
      }
    }
    if (method == "get" || method == "post") {
      const result = this.borrowingFromAnother(recordTag);
      if (result != null) {
        this.setResponse(result);
        this._variables.error = "";
        this._variables.isError = false;
        this._variables.isLoading = false;
        endRequest(result);
        if (this._onEnd)
          this._onEnd(result);
        return result;
      }
    }
    this.swapLazy();
    const url = urlPathParams(this._url, this._pathParams) + queryToUrl(queries);
    const headers = {};
    for (const [key, value] of Object.entries(defaultHeaders))
      headers[key] = refOrVar(value);
    for (const [key, value] of Object.entries(this._headers))
      headers[key] = refOrVar(value);
    const options2 = {
      // Append headers + auth
      headers: appendMerge(headers, { "Authorization": refOrVar(this._auth) }),
      method
    };
    if (this._body != null) {
      options2.body = refOrVar(this._body);
      if (options2.body instanceof FormData)
        delete headers["Content-Type"];
      else if (typeof options2.body == "object")
        options2.body = JSON.stringify(this._body);
    }
    let fetchResult = await storeFetch(url, options2, this._isBlob, this._template);
    if (fetchResult.error) {
      const answer = await (this._onError || defaultFetchFailure)({ text: fetchResult.errorText, code: fetchResult.code }, () => this.doFetch(method));
      if (typeof answer == "object") {
        fetchResult.data = answer;
        fetchResult.error = false;
      }
    }
    this.setResponse(fetchResult.data);
    this._variables.error = fetchResult.errorText;
    this._variables.maxPages = fetchResult.pageCount;
    this._variables.isError = fetchResult.error;
    this._variables.isLoading = false;
    this._variables.headers = fetchResult.header;
    if (fetchResult.protocol != null) {
      this._protocol = fetchResult.protocol;
    }
    this.keep(fetchResult.data, recordTag);
    if (this._onEnd)
      this._onEnd(fetchResult.data);
    endRequest(fetchResult.data);
    return fetchResult.data;
  }
  /** Erase response after call doFetch */
  swapGreedy() {
    if (this._swapMethod == ESwapMethod.GREEDY && !this._variables.expandResponse) {
      this.clearResponse();
    }
  }
  /** Erase response after borrow function */
  swapLazy() {
    if (this._swapMethod == ESwapMethod.LAZY && !this._variables.expandResponse) {
      this.clearResponse();
    }
  }
  /**
   * Compare tags see `createTag`
   */
  static compareTags(tags, other, otherLast) {
    for (const [name] of Object.entries(tags)) {
      const value = refOrVar(tags[name]);
      if (!(name in other))
        return false;
      if (otherLast && name in otherLast) {
        if (value == "<>" && otherLast[name] != other[name])
          continue;
      }
      const otherValue = other[name] ?? null;
      if (value == otherValue)
        continue;
      if (value == "*" && otherValue != null || otherValue == "*" && value != null)
        continue;
      return false;
    }
    return true;
  }
  // Write response to Record
  setResponse(v) {
    if (this._variables.expandResponse) {
      if (!this._variables.response)
        this._variables.response = [];
      this._variables.response.push(...v);
    } else {
      this._variables.response = v;
    }
    return this._variables.response;
  }
  // Cache response by Tags
  async keep(response, recordTag) {
    for (const [key] of this._allCachedResponse.entries()) {
      if (_Record.compareTags(key, recordTag)) {
        this._allCachedResponse.set(key, response);
        return;
      }
    }
    this._allCachedResponse.set(
      recordTag,
      // Generate tag
      response
    );
  }
};

// node_modules/nuxoblivius/dist/ts/index.js
var isClient2 = typeof document !== "undefined";
var storageOfStores = /* @__PURE__ */ new Map();
var laterAwaiter = [];
function deleteDump() {
  const recursiveDeleteDump = (_value) => {
    if (_value._variables) {
      for (const [key, value] of Object.entries(_value._variables)) {
        _value._variables[key] = _value._defaults[key];
      }
    }
    if (_value._stores) {
      for (const [key, value] of Object.entries(_value._stores)) {
        recursiveDeleteDump(value);
      }
    }
    for (const name of Object.getOwnPropertyNames(_value)) {
      const value = _value[name];
      if (typeof value == "object" && value != null && "_variables" in value && value._variables && typeof value._variables == "object" && "response" in value._variables) {
        value._variables.response = null;
      }
    }
  };
  for (const [key, value] of storageOfStores.entries()) {
    recursiveDeleteDump(value);
  }
}
function create_proxy(target, get, has = (t, p) => true) {
  return new Proxy({}, {
    get(target2, p, receiver) {
      return get(target2, p, receiver);
    },
    has(target2, p) {
      return has(target2, p);
    }
  });
}
function raise(store) {
  store.prototype.ref = create_proxy({}, (t, p) => create_proxy({}, (subT, subP) => {
    return instance.ref[p][subP];
  }, () => true), () => true);
  const instance = new store();
  const variables = reactive({});
  Object.defineProperty(instance, "_defaults", {
    value: {},
    configurable: false
  });
  Object.defineProperty(instance, "_variables", {
    get() {
      return variables;
    },
    configurable: false
  });
  Object.defineProperty(instance, "_stores", {
    value: {},
    configurable: false
  });
  Object.defineProperty(instance, "_watcher", {
    value: {},
    configurable: false
  });
  Object.defineProperty(instance, "ref", {
    get() {
      const proxy = create_proxy(
        store,
        // where we create proxy-object for store
        (target, p, receiver) => {
          if (p in instance) {
            return {
              _module_: "EX-REF",
              get value() {
                return instance[p];
              },
              name: p,
              get isEmpty() {
                const value = instance[p];
                return typeof value == "undefined" || value == null;
              },
              get isImportant() {
                return p[0] == "$";
              },
              watch(func) {
                if (!isClient2)
                  return;
                if (!(p in instance._watcher)) {
                  later(() => instance._watcher[p].push(func));
                } else {
                  instance._watcher[p].push(func);
                }
              }
            };
          }
          throw `Object ${p} not founed`;
        }
      );
      return proxy;
    }
  });
  const triggerToChanges = (nameObject) => {
    if (instance._watcher[nameObject]) {
      for (const func of instance._watcher[nameObject]) {
        func();
      }
    }
  };
  const objectDefineReadOnly = (name, to, as = "_variables") => {
    Object.defineProperty(instance, name, {
      get() {
        return instance[as][to];
      }
    });
  };
  const objectDefine = (name, to, as = "_variables") => {
    Object.defineProperty(instance, name, {
      get() {
        return instance[as][to];
      },
      set(v) {
        instance[as][to] = v;
        triggerToChanges(to);
      }
    });
    instance._watcher[name] = [];
  };
  const isDefaultVar = (name) => name == "ref" || name == "_defaults" || name == "_stores" || name == "_variables" || name == "_watcher";
  for (const propertyName of Object.getOwnPropertyNames(instance)) {
    if (isDefaultVar(propertyName))
      continue;
    const valueOfProperty = instance[propertyName];
    const isNotClassObject = (v = valueOfProperty) => typeof v != "undefined" && v != null && (typeof v != "object" || (typeof v == "object" && Object.getPrototypeOf(v).__proto__ == null || Array.isArray(v)));
    if (typeof valueOfProperty == "undefined") {
      if ("_" + propertyName in instance) {
        if (isNotClassObject(instance["_" + propertyName])) {
          instance._variables[propertyName] = instance["_" + propertyName];
          instance._defaults[propertyName] = instance["_" + propertyName];
          objectDefineReadOnly(propertyName, propertyName);
          objectDefine("_" + propertyName, propertyName);
        } else {
          instance._stores[propertyName] = instance["_" + propertyName];
          objectDefineReadOnly(propertyName, propertyName, "_stores");
          objectDefine("_" + propertyName, propertyName, "_stores");
        }
      }
    } else if ((isNotClassObject() || valueOfProperty == null) && propertyName[0] != "_") {
      instance._variables[propertyName] = valueOfProperty;
      instance._defaults[propertyName] = valueOfProperty;
      objectDefine(propertyName, propertyName);
    }
  }
  for (const [name, value] of Object.entries(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(instance)))) {
    if (isDefaultVar(name))
      continue;
    if (typeof value.value == "undefined" && typeof value.get == "undefined") {
      if ("_" + name in instance) {
        instance._variables[name] = instance["_" + name];
        instance._defaults[name] = instance["_" + name];
        Object.defineProperty(instance, name, {
          get() {
            return instance._variables[name];
          },
          set(v) {
            value.set.call(instance, v);
          }
        });
        Object.defineProperty(instance, "_" + name, {
          get() {
            return instance._variables[name];
          },
          set(v) {
            instance._variables[name] = v;
            triggerToChanges(name);
          }
        });
        instance._watcher[name] = [];
      }
    }
  }
  if ("mounted" in instance) {
    instance.mounted();
  }
  return instance;
}
function defineStore(store) {
  const objectStore = storageOfStores.get(store);
  if (typeof objectStore == "undefined") {
    let object = raise(store);
    storageOfStores.set(store, object);
    return object;
  }
  return objectStore;
}
function subStore(object) {
  return raise(object);
}
function later(callback) {
  if (typeof localStorage == "undefined") {
    return new Promise((resolve, reject) => {
      laterAwaiter.push(() => {
        resolve(callback());
      });
    });
  }
  return callback();
}

// node_modules/nuxoblivius/index.js
var SetDefaultHeader = setDefaultHeader;
var SetDefaultAuth = setDefaultAuth;
var SetRequestFailure = setRequestFailure;
var ExtendsPattern = extendsPattern;
var CallPattern = callPattern;
var RegisterTemplate = settings.template;
var Record2 = Record;
var IStore = class {
};
export {
  CallPattern,
  ExtendsPattern,
  IStore,
  Record2 as Record,
  RegisterTemplate,
  SetDefaultAuth,
  SetDefaultHeader,
  SetRequestFailure,
  defineStore,
  deleteDump,
  later,
  subStore,
  toRefRaw
};
//# sourceMappingURL=nuxoblivius.js.map

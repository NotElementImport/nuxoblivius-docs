# Примеры
## 1
```ts
import SM, { state } from "nuxoblivius";

export default class Language extends SM<Language> {
    protected static globalName = 'language'

    public current = state<string>('ru')
        .keep("globals.currentLanguage", Infinity)
        .place(['cookie', 'localStorage'])
        .one()

    public currentAlias = state<string>('ru-RU')
        .keep("globals.currentLangAlias", Infinity)
        .place(['cookie', 'localStorage'])
        .one()

    constructor() {
        super(Language.globalName)
        this.manage()
    }
}
```

## 2
```ts
import SM, { state } from "nuxoblivius";
import Language from "./language";
import type { ICabinet, IFilterOption } from '@/types/interfaces'
import FilterCabinets from '@/module/filters/filterCabinets'

export default class Cabinets extends SM<Cabinets> {

    public filters = state<IFilterOption>([])
        .api('/api/service')
        .map((el: IFilterOption) => ({
            title: el.title,
            id: el.id,
            val: false
        }))
        .template('yii2-data-provider')
        .join(Language.ref('currentAlias'))
        .joinToQuery("lang", Language.ref('currentAlias'))
        .many()

    public searchFilters = state<IFilterOption>([{title: 'kaspi_red', val: false},
            {title: 'is_works_on_weekends', val: false},
            {title: 'discount', val: false}])
        .many()
        
    public seachQuery = state<string>('')
        .one()

    public items = state<ICabinet>( [])
        .api('/api/procedure-cabinet')
        .template('yii2-data-provider')
        .hook('on end', (value) => {
            this.randItem = value[Math.floor(Math.random() * value.length)]
        })
        .join('areas.currentID')
        .joinToQuery("filter[city_id]", "areas.currentID")
        .join(Language.ref('currentAlias'))
        .joinToQuery("lang", Language.ref('currentAlias'))
        .filter(FilterCabinets.ref(), true)
        .many()

    public randItem = state<ICabinet>({})
        .one()

    public item = state<ICabinet>({})
        .api("/api/procedure-cabinet")
        .template('yii2-data-provider')
        .join(this.items, "slug")
        .join(Language.ref('currentAlias'))
        .joinToQuery("lang", Language.ref('currentAlias'))
        .one()

    constructor() {
        super("cabinets")
        this.manage()
    }
}
```

## 3
```ts
import SM, { state } from "nuxoblivius";
import Language from "./language";
import Areas from './areas'
import type { IAnalysis, IAnalyzesGroup } from '@/types/interfaces'
import Filter from 'nuxoblivius/filter'

class FilterBasket extends Filter {
    protected static globalName = 'FilterBasket'

    protected setup() {
        this.createFilter({
            'filter[visit]': this.type.array(),
            'search': this.type.string()
        })
    }
}

export default class Basket extends SM<Basket> {
    protected static globalName = 'basket'

    public ids = state<number[]>([])
        .keep("globals.currentBasket", Infinity)
        .place(['localStorage'])
        .cacheType('json')
        .one()

    public items = state<IAnalysis>( [])
        .api({
            path: '/api/analysis-category',
            query: {
                expand: true,
                'filter[visit]': this.ids.join(',') || -1
            }
        })
        .map((el: IAnalyzesGroup) => {
            return el.analyzes
        })
        .flat()
        .template('yii2-data-provider')
        .join(Language.ref('currentAlias'))
        .joinToQuery("lang", Language.ref('currentAlias'))
        .joinToQuery("filter[city_id]", "areas.currentID")
        .filter(FilterBasket.ref(), true)
        .many()
    
    public isChange = state(false)
        .one()

    public Clear() {
        this.items.value = []
        this.ids = []
        this.isChange = false
    }

    public parseBasket() {
        (Array.isArray(this.ids) && this.ids.length) ? this.items.user().all() : this.items.value = []
    }

    public basketToggle(item?: IAnalysis) {
        if (item) {
            const basketItems = this.ids
            const ind = basketItems.indexOf(+item.id)
            if (ind >= 0) {
                basketItems.splice(ind, 1)
                this.items.value.splice(this.items.value.findIndex(el => el.id == item.id), 1)
            }
            else {
                basketItems.push(item.id)
                this.items.value.push(item)
            }
            this.ids = basketItems
        }
    }

    constructor() {
        super("basket")
        this.manage()
        this.watch('items', () => {
            this.isChange = this.items.value.length < this.ids.length
        })
    }
}
```

## 4
```ts
import SM, { state } from "nuxoblivius";
import Language from "./language";
import type { ICity, IArea } from '@/types/interfaces'

export default class Areas extends SM<Areas> {
    protected static globalName = 'areas'

    public current = state<ICity>({})
        .one()

    public currentID = state<number>(0)
        .keep('currentCity', Infinity)
        .place(['cookie', 'localStorage'])
        .one()

    public currentLocateID = state<number>(0)
        .keep('currentLocateID', Infinity)
        .place(['cookie', 'localStorage'])
        .one()

    public currentHousecallID = state<number>(0)
        .keep('currentCity', Infinity)
        .place(['cookie', 'localStorage'])
        .one()

    public areas = state<IArea>( [])
        .api("/api/area")
        .hook('before process', () => {
            this.cities = []
        })
        .map((el: IArea) => {
            el.cities.sort((a, b) => {
                if (a.weight == null && b.weight == null) return a.title.toLowerCase().trim().localeCompare(b.title.toLowerCase().trim())
                if (a.weight == null) return 1
                if (b.weight == null) return -1
                return +a.weight - +b.weight
            })
            this.cities = this.cities.concat(el.cities)
            
            return el
        })
        .sort((a, b) => {
            if ((a.is_federal || a.cities.some(el => +el.id == this.currentID)) && (b.is_federal || b.cities.some(el => +el.id == this.currentID))) {
                if (a.is_federal) return -0.5
                return 0.5
            }
            if (a.is_federal || a.cities.some(el => +el.id == this.currentID)) return -1
            if (b.is_federal || b.cities.some(el => +el.id == this.currentID)) return 1
            return a.title?.toLowerCase().localeCompare(b.title?.toLowerCase())
        })
        .template('yii2-data-provider')
        .join(this.currentID, 'only-sort')
        .join(Language.ref('currentAlias'))
        .joinToQuery("lang", Language.ref('currentAlias'))
        .many()

    public cities = state<ICity>([])
        .many()

    public houseCities = state<IArea>([])
        .many()

    constructor() {
        super("areas")
        this.manage()
        
        this.watch('currentID', () => {
            this.current = this.cities.find(el => +el.id == +this.currentID) as ICity
        })
        this.watch('currentID', () => {
            this.currentHousecallID = this.currentID
        })
        this.watch('areas', () => {
            this.houseCities = this.areas.value.filter(el => el.cities.some(el => +el.is_home_visit)).map(obj => ({...obj, cities: obj.cities.filter(elem => +elem.is_home_visit)}))
            this.current = this.cities.find(el => +el.id == +this.currentID) as ICity
        })
    }
}
```

## 5
```ts
import SM, { state } from "nuxoblivius"
import type { ISendingFeedback } from "~/types/interfaces"
import Auth from "./authNx"

export default class Feedback extends SM<Feedback> {

    public feedback = state<ISendingFeedback>([])
        .api("/api/user/feedback/store",
        {
            method: 'POST'
        })
        .auth(Auth.ref('token'))
        .template('my-data')
        .one()
    
    public feedbackEdit = state<ISendingFeedback>([])
        .api("/api/user/feedback/update")
        .auth(Auth.ref('token'))
        .template('my-data')
        .one()
    
    constructor() {
        super("feedback")
        this.manage()
    }
}
```

## 6
```ts
import SM, { state } from "nuxoblivius";
import Language from "./language";
import type { IArticle } from '@/types/interfaces'

export default class Articles extends SM<Articles> {
    public items = state<IArticle>( [])
        .api("/api/pages")
        .pagination(5, true)
        .many()

    public item = state<IArticle>({})
        .api("/api/pages")
        .join(this.items, "slug")
        .one()

    constructor() {
        super("articles")
        this.manage()
    }
}
```
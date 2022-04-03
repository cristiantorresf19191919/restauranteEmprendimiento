<template>
    <div>
        <div class="p-fluid grid">
            <div class="field col-12 md:col-4">
                <InputText id="inputtext" type="text" v-model="value1" placeholder="InputText" class="p-invalid" />
            </div>
            <div class="field col-12 md:col-4">
                <AutoComplete v-model="value2" :suggestions="filteredCountries" @complete="searchCountry($event)" field="name" placeholder="AutoComplete" class="p-invalid" />
            </div>
            <div class="field col-12 md:col-4">
                <Calendar id="calendar" v-model="value3" placeholder="Calendar" class="p-invalid" :showIcon="true" />
            </div>
            <div class="field col-12 md:col-4">
                <Chips id="chips" v-model="value4" placeholder="Chips" class="p-invalid" />
            </div>
            <div class="field col-12 md:col-4">
                <InputMask id="inputmask" v-model="value5" mask="99/99/9999" slotChar="mm/dd/yyyy" placeholder="InputMask" class="p-invalid" />
            </div>
            <div class="field col-12 md:col-4">
                <InputNumber id="inputnumber" v-model="value6" placeholder="InputNumber" class="p-invalid" />
            </div>
            <div class="field col-12 md:col-4">
                <CascadeSelect v-model="selectedCity" :options="cascadeCountries" optionLabel="cname" optionGroupLabel="name"
                    :optionGroupChildren="['states', 'cities']" placeholder="CascadeSelect" class="p-invalid" />
            </div>
            <div class="field col-12 md:col-4">
                <Dropdown id="dropdown" v-model="value7" :options="cities" optionLabel="name" placeholder="Dropdown" class="p-invalid" />
            </div>
            <div class="field col-12 md:col-4">
                <MultiSelect id="multiselect" v-model="value8" :options="cities" optionLabel="name" placeholder="MultiSelect" class="p-invalid" />
            </div>
            <div class="field col-12 md:col-4">
                <TreeSelect id="treeselect" v-model="selectedNode" :options="nodes" placeholder="TreeSelect" class="p-invalid"></TreeSelect>
            </div>
            <div class="field col-12 md:col-4">
                <Password id="password" v-model="value10" placeholder="Password" class="p-invalid" />
            </div>
            <div class="field col-12 md:col-4">
                <Textarea id="textarea" v-model="value9" rows="3" placeholder="Textarea" class="p-invalid" />
            </div>
        </div>
    </div>                   
</template>
<script>
import { ref, onMounted } from 'vue';
import CountryService from './service/CountryService';
import NodeService from './service/NodeService';

export default {
    setup() {
        onMounted(() => {
            countryService.value.getCountries().then(data => countries.value = data);
            nodeService.value.getTreeNodes().then(data => nodes.value = data);
        })
        const countryService = ref(new CountryService());
        const nodeService = ref(new NodeService());
        const countries = ref();
        const filteredCountries = ref();
        const cities = ref([
            {name: 'New York', code: 'NY'},
            {name: 'Rome', code: 'RM'},
            {name: 'London', code: 'LDN'},
            {name: 'Istanbul', code: 'IST'},
            {name: 'Paris', code: 'PRS'}
        ]);
        const value1 = ref();
        const value2 = ref();
        const value3 = ref();
        const value4 = ref();
        const value5 = ref();
        const value6 = ref();
        const value7 = ref();
        const value8 = ref();
        const value9 = ref();
        const value10 = ref();
        const selectedCity = ref();
        const selectedNode = ref();
        const nodes = ref();
        const cascadeCountries = ref([
            {
                name: 'Australia',
                code: 'AU',
                states: [
                    {
                        name: 'New South Wales',
                        cities: [
                            {cname: 'Sydney', code: 'A-SY'},
                            {cname: 'Newcastle', code: 'A-NE'},
                            {cname: 'Wollongong', code: 'A-WO'}
                        ]
                    },
                    {
                        name: 'Queensland',
                        cities: [
                            {cname: 'Brisbane', code: 'A-BR'},
                            {cname: 'Townsville', code: 'A-TO'}
                        ]
                    },
                    
                ]
            },
            {
                name: 'Canada', 
                code: 'CA',
                states: [
                    {
                        name: 'Quebec',
                        cities: [
                            {cname: 'Montreal', code: 'C-MO'},
                            {cname: 'Quebec City', code: 'C-QU'}
                        ]
                    },
                    {
                        name: 'Ontario',
                        cities: [
                            {cname: 'Ottawa', code: 'C-OT'},
                            {cname: 'Toronto', code: 'C-TO'}
                        ]
                    },
                    
                ]
            },
            {
                name: 'United States',
                code: 'US',
                states: [
                    {
                        name: 'California',
                        cities: [
                            {cname: 'Los Angeles', code: 'US-LA'},
                            {cname: 'San Diego', code: 'US-SD'},
                            {cname: 'San Francisco', code: 'US-SF'}
                        ]
                    },
                    {
                        name: 'Florida',
                        cities: [
                            {cname: 'Jacksonville', code: 'US-JA'},
                            {cname: 'Miami', code: 'US-MI'},
                            {cname: 'Tampa', code: 'US-TA'},
                            {cname: 'Orlando', code: 'US-OR'}
                        ]
                    },
                    {
                        name: 'Texas',
                        cities: [
                            {cname: 'Austin', code: 'US-AU'},
                            {cname: 'Dallas', code: 'US-DA'},
                            {cname: 'Houston', code: 'US-HO'}
                        ]
                    }
                ]
            }
        ]);

        const searchCountry = (event) => {
            setTimeout(() => {
                if (!event.query.trim().length) {
                    filteredCountries.value = [...countries.value];
                }
                else {
                    filteredCountries.value = countries.value.filter((country) => {
                        return country.name.toLowerCase().startsWith(event.query.toLowerCase());
                    });
                }
            }, 250);
        }

        return { countryService, countries, filteredCountries, cities, value1, value2, value3, value4, 
            value5, value6, value7, value8, value9, value10, selectedCity, cascadeCountries, searchCountry,
            nodes, selectedNode  }

    }
}
</script>
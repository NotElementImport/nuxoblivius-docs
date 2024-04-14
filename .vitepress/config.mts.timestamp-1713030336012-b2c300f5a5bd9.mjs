// .vitepress/config.mts
import { defineConfig } from "file:///C:/web/nuxoblivius-docs/nuxoblivius-docs/_dev/node_modules/vitepress/dist/node/index.js";
var config_default = defineConfig({
  title: "Nuxoblivius",
  description: "A Power Store for Vue and Nuxt",
  themeConfig: {
    logoLink: "/",
    logo: "/NX-Logo-Temp.png",
    carbonAds: void 0,
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "1.0.0", link: "/release/overview" },
      { text: "0.4.X", link: "/beta/overview" },
      { text: "Examples", link: "/markdown-examples/" }
    ],
    sidebar: [
      {
        text: "Release",
        items: [
          { text: "Overview", link: "/release/overview" },
          { text: "Setup", link: "/release/setup" },
          { text: "Store", link: "/release/store", items: [
            { text: "Prop", link: "/release/store/prop" },
            { text: "Prop (Encapsulation)", link: "/release/store/prop-encapsulation" },
            { text: "Records", link: "/release/store/records" },
            { text: "Storage", link: "/release/store/storage" },
            { text: "Dynamic Params", link: "/release/store/dynamic-params" }
          ] },
          { text: "Sub Stores", link: "/release/sub-store" },
          { text: "Records", link: "/release/records" },
          { text: "Storage", link: "/release/storage" }
        ]
      },
      {
        text: "Beta",
        items: [
          // { text: "Overview", link: "/beta/overview", rel: "check" },
          // { text: "Setup", link: "/beta/setup" },
          { text: "Store", link: "/beta/store/defineStore", items: [
            { text: "Methods", link: "/beta/store/methods" },
            { text: "Filter", link: "/beta/store/filter" }
          ] },
          { text: "Examples", link: "/beta/examples" }
        ]
      }
      // {
      //   text: 'Examples',
      //   items: [
      //     { text: 'Release', link: '/markdown-examples' },
      //     { text: 'Beta', link: '/api-examples' }
      //   ]
      // }
    ],
    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ],
    footer: {
      copyright: "Powered by notelementimport & Perfect03",
      message: "Power store for Nuxt and Vue"
    }
  }
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLnZpdGVwcmVzcy9jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcd2ViXFxcXG51eG9ibGl2aXVzLWRvY3NcXFxcbnV4b2JsaXZpdXMtZG9jc1xcXFxfZGV2XFxcXC52aXRlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXHdlYlxcXFxudXhvYmxpdml1cy1kb2NzXFxcXG51eG9ibGl2aXVzLWRvY3NcXFxcX2RldlxcXFwudml0ZXByZXNzXFxcXGNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L3dlYi9udXhvYmxpdml1cy1kb2NzL251eG9ibGl2aXVzLWRvY3MvX2Rldi8udml0ZXByZXNzL2NvbmZpZy5tdHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlcHJlc3MnXHJcblxyXG4vLyBodHRwczovL3ZpdGVwcmVzcy5kZXYvcmVmZXJlbmNlL3NpdGUtY29uZmlnXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgdGl0bGU6IFwiTnV4b2JsaXZpdXNcIixcclxuICBkZXNjcmlwdGlvbjogXCJBIFBvd2VyIFN0b3JlIGZvciBWdWUgYW5kIE51eHRcIixcclxuICB0aGVtZUNvbmZpZzoge1xyXG4gICAgbG9nb0xpbms6ICcvJyxcclxuICAgIGxvZ286ICcvTlgtTG9nby1UZW1wLnBuZycsXHJcbiAgICBjYXJib25BZHM6IHVuZGVmaW5lZCxcclxuXHJcbiAgICAvLyBodHRwczovL3ZpdGVwcmVzcy5kZXYvcmVmZXJlbmNlL2RlZmF1bHQtdGhlbWUtY29uZmlnXHJcbiAgICBuYXY6IFtcclxuICAgICAgeyB0ZXh0OiAnMS4wLjAnLCBsaW5rOiAnL3JlbGVhc2Uvb3ZlcnZpZXcnIH0sXHJcbiAgICAgIHsgdGV4dDogJzAuNC5YJywgbGluazogJy9iZXRhL292ZXJ2aWV3JyB9LFxyXG4gICAgICB7IHRleHQ6ICdFeGFtcGxlcycsIGxpbms6ICcvbWFya2Rvd24tZXhhbXBsZXMvJyB9XHJcbiAgICBdLFxyXG5cclxuICAgIHNpZGViYXI6IFtcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6ICdSZWxlYXNlJyxcclxuICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgeyB0ZXh0OiAnT3ZlcnZpZXcnLCBsaW5rOiAnL3JlbGVhc2Uvb3ZlcnZpZXcnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdTZXR1cCcsIGxpbms6ICcvcmVsZWFzZS9zZXR1cCcgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1N0b3JlJywgbGluazogJy9yZWxlYXNlL3N0b3JlJywgaXRlbXM6IFtcclxuICAgICAgICAgICAgeyB0ZXh0OiAnUHJvcCcsIGxpbms6ICcvcmVsZWFzZS9zdG9yZS9wcm9wJyx9LFxyXG4gICAgICAgICAgICB7IHRleHQ6ICdQcm9wIChFbmNhcHN1bGF0aW9uKScsIGxpbms6ICcvcmVsZWFzZS9zdG9yZS9wcm9wLWVuY2Fwc3VsYXRpb24nLH0sXHJcbiAgICAgICAgICAgIHsgdGV4dDogJ1JlY29yZHMnLCBsaW5rOiAnL3JlbGVhc2Uvc3RvcmUvcmVjb3JkcycsfSxcclxuICAgICAgICAgICAgeyB0ZXh0OiAnU3RvcmFnZScsIGxpbms6ICcvcmVsZWFzZS9zdG9yZS9zdG9yYWdlJyx9LFxyXG4gICAgICAgICAgICB7IHRleHQ6ICdEeW5hbWljIFBhcmFtcycsIGxpbms6ICcvcmVsZWFzZS9zdG9yZS9keW5hbWljLXBhcmFtcycsfSxcclxuICAgICAgICAgIF0gfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1N1YiBTdG9yZXMnLCBsaW5rOiAnL3JlbGVhc2Uvc3ViLXN0b3JlJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnUmVjb3JkcycsIGxpbms6ICcvcmVsZWFzZS9yZWNvcmRzJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnU3RvcmFnZScsIGxpbms6ICcvcmVsZWFzZS9zdG9yYWdlJyB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGV4dDogJ0JldGEnLFxyXG4gICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICB7IHRleHQ6ICdPdmVydmlldycsIGxpbms6ICcvYmV0YS9vdmVydmlldycsIHJlbDogJ2NoZWNrJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnU2V0dXAnLCBsaW5rOiAnL2JldGEvc2V0dXAnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdTdG9yZScsIGxpbms6ICcvYmV0YS9zdG9yZS9kZWZpbmVTdG9yZScsIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgIHsgdGV4dDogJ01ldGhvZHMnLCBsaW5rOiAnL2JldGEvc3RvcmUvbWV0aG9kcycsfSxcclxuICAgICAgICAgICAgeyB0ZXh0OiAnRmlsdGVyJywgbGluazogJy9iZXRhL3N0b3JlL2ZpbHRlcicsfSxcclxuICAgICAgICAgIF0gfSxcclxuICAgICAgICAgIHsgdGV4dDogJ0V4YW1wbGVzJywgbGluazogJy9iZXRhL2V4YW1wbGVzJyB9LFxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAgLy8ge1xyXG4gICAgICAvLyAgIHRleHQ6ICdFeGFtcGxlcycsXHJcbiAgICAgIC8vICAgaXRlbXM6IFtcclxuICAgICAgLy8gICAgIHsgdGV4dDogJ1JlbGVhc2UnLCBsaW5rOiAnL21hcmtkb3duLWV4YW1wbGVzJyB9LFxyXG4gICAgICAvLyAgICAgeyB0ZXh0OiAnQmV0YScsIGxpbms6ICcvYXBpLWV4YW1wbGVzJyB9XHJcbiAgICAgIC8vICAgXVxyXG4gICAgICAvLyB9XHJcbiAgICBdLFxyXG5cclxuICAgIC8vIHNvY2lhbExpbmtzOiBbXHJcbiAgICAvLyAgIHsgaWNvbjogJ2dpdGh1YicsIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vdnVlanMvdml0ZXByZXNzJyB9XHJcbiAgICAvLyBdLFxyXG5cclxuICAgIGZvb3Rlcjoge1xyXG4gICAgICBjb3B5cmlnaHQ6IFwiUG93ZXJlZCBieSBub3RlbGVtZW50aW1wb3J0ICYgUGVyZmVjdDAzXCIsXHJcbiAgICAgIG1lc3NhZ2U6IFwiUG93ZXIgc3RvcmUgZm9yIE51eHQgYW5kIFZ1ZVwiXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThWLFNBQVMsb0JBQW9CO0FBRzNYLElBQU8saUJBQVEsYUFBYTtBQUFBLEVBQzFCLE9BQU87QUFBQSxFQUNQLGFBQWE7QUFBQSxFQUNiLGFBQWE7QUFBQSxJQUNYLFVBQVU7QUFBQSxJQUNWLE1BQU07QUFBQSxJQUNOLFdBQVc7QUFBQTtBQUFBLElBR1gsS0FBSztBQUFBLE1BQ0gsRUFBRSxNQUFNLFNBQVMsTUFBTSxvQkFBb0I7QUFBQSxNQUMzQyxFQUFFLE1BQU0sU0FBUyxNQUFNLGlCQUFpQjtBQUFBLE1BQ3hDLEVBQUUsTUFBTSxZQUFZLE1BQU0sc0JBQXNCO0FBQUEsSUFDbEQ7QUFBQSxJQUVBLFNBQVM7QUFBQSxNQUNQO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixPQUFPO0FBQUEsVUFDTCxFQUFFLE1BQU0sWUFBWSxNQUFNLG9CQUFvQjtBQUFBLFVBQzlDLEVBQUUsTUFBTSxTQUFTLE1BQU0saUJBQWlCO0FBQUEsVUFDeEMsRUFBRSxNQUFNLFNBQVMsTUFBTSxrQkFBa0IsT0FBTztBQUFBLFlBQzlDLEVBQUUsTUFBTSxRQUFRLE1BQU0sc0JBQXNCO0FBQUEsWUFDNUMsRUFBRSxNQUFNLHdCQUF3QixNQUFNLG9DQUFvQztBQUFBLFlBQzFFLEVBQUUsTUFBTSxXQUFXLE1BQU0seUJBQXlCO0FBQUEsWUFDbEQsRUFBRSxNQUFNLFdBQVcsTUFBTSx5QkFBeUI7QUFBQSxZQUNsRCxFQUFFLE1BQU0sa0JBQWtCLE1BQU0sZ0NBQWdDO0FBQUEsVUFDbEUsRUFBRTtBQUFBLFVBQ0YsRUFBRSxNQUFNLGNBQWMsTUFBTSxxQkFBcUI7QUFBQSxVQUNqRCxFQUFFLE1BQU0sV0FBVyxNQUFNLG1CQUFtQjtBQUFBLFVBQzVDLEVBQUUsTUFBTSxXQUFXLE1BQU0sbUJBQW1CO0FBQUEsUUFDOUM7QUFBQSxNQUNGO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sT0FBTztBQUFBLFVBQ0wsRUFBRSxNQUFNLFlBQVksTUFBTSxrQkFBa0IsS0FBSyxRQUFRO0FBQUEsVUFDekQsRUFBRSxNQUFNLFNBQVMsTUFBTSxjQUFjO0FBQUEsVUFDckMsRUFBRSxNQUFNLFNBQVMsTUFBTSwyQkFBMkIsT0FBTztBQUFBLFlBQ3ZELEVBQUUsTUFBTSxXQUFXLE1BQU0sc0JBQXNCO0FBQUEsWUFDL0MsRUFBRSxNQUFNLFVBQVUsTUFBTSxxQkFBcUI7QUFBQSxVQUMvQyxFQUFFO0FBQUEsVUFDRixFQUFFLE1BQU0sWUFBWSxNQUFNLGlCQUFpQjtBQUFBLFFBQzdDO0FBQUEsTUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFRRjtBQUFBO0FBQUE7QUFBQTtBQUFBLElBTUEsUUFBUTtBQUFBLE1BQ04sV0FBVztBQUFBLE1BQ1gsU0FBUztBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K

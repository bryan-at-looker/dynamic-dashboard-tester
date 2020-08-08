project_name: "tester"

application: tester {
  label: "Dynamic Dashboard Control Tester"
  file: "dist/bundle.js"
  entitlements: {
    local_storage: yes
    allow_same_origin: yes
    navigation: yes
    core_api_methods: ["all_dashboards","search_content_favorites", "search_dashboards", "me"]
  }
}

<template lang="pug">
.virtual-table-column
</template>

<script>
export default {
  name: 'VirtualTableColumn',
  componentName: 'VirtualTableColumn',
  props: {
    bordered: Boolean,
    fixed: [Boolean, String],
    label: String,
    prop: String,
    summaryProp: String,
    summaryTitle: String,
    type: String,
    width: { type: [Number, String], default: 50 }
  },
  computed: {
    property: ({ prop }) => prop
  }
}
</script>

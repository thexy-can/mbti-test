<!-- SvgIcon.vue -->
<template>
 <svg :class="svgClass" >
   <use :xlink:href="iconName" />
 </svg>
</template>
<script>
export default {
 name: "SvgIcon",
 props: {
   iconName: {
     type: String,
     required: true,
   },
   svgClass: {
     type: String,
     default: "svg-icon",
   },
 },
};
</script>
<!-- <style scoped>
svg-icon {
 width: 1em;
 height: 1em;
 fill: currentColor;
}
</style> -->
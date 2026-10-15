import { ref } from 'vue'

/** El layout sin cascarón del catálogo solo aplica con acceso confirmado; sin él, /admin/ui luce como un 404 más. */
export const kitUnlocked = ref(false)

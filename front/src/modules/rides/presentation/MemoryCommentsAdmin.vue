<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { MEMORY_COMMENTS_MOD_COPY } from '@modules/rides/constants/copy.ts'
import {
  MEMORY_COMMENT_STATUSES,
  isMemoryCommentStatus,
  type MemoryCommentCounts,
  type MemoryCommentStatus,
  type OperatorMemoryComment,
} from '@modules/rides/domain/entities/MemoryComment.ts'
import type { RidesModule } from '@modules/rides/composition.ts'
import MemoryCommentRemoveModal from '@modules/rides/presentation/MemoryCommentRemoveModal.vue'
import { formatCommentDate, statusTone } from '@modules/rides/presentation/memoryCommentView.ts'
import { modActionLabel, modActionsFor, useCommentModeration } from '@modules/rides/presentation/useCommentModeration.ts'
import AdminPane from '@ui/AdminPane.vue'
import Button from '@ui/Button.vue'
import Chip from '@ui/Chip.vue'
import FilterPills from '@ui/FilterPills.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: RidesModule
  clave: string
}>()

const copy = MEMORY_COMMENTS_MOD_COPY
const ALL = 'todos'

const filter = ref<string>('en_revision')
const comments = ref<readonly OperatorMemoryComment[]>([])
const counts = ref<MemoryCommentCounts>({ en_revision: 0, publicado: 0, rechazado: 0, oculto: 0 })
const loading = ref(false)

const total = computed(() => MEMORY_COMMENT_STATUSES.reduce((sum, status) => sum + counts.value[status], 0))
const pills = computed(() => [
  ...MEMORY_COMMENT_STATUSES.map((status) => ({
    id: status,
    label: `${copy.statusLabels[status]} · ${counts.value[status]}`,
  })),
  { id: ALL, label: `${copy.filterAll} · ${total.value}` },
])

async function load(): Promise<void> {
  loading.value = true
  const status: MemoryCommentStatus | undefined = isMemoryCommentStatus(filter.value) ? filter.value : undefined
  const result = await props.module.comments.listOperator({ status }, props.clave)
  loading.value = false
  if (!result.ok) {
    showToast(result.error.message || copy.loadFail, 'bad')
    return
  }
  comments.value = result.value.comments
  counts.value = result.value.counts
}

const { busy, removing, run, confirmRemove } = useCommentModeration(
  () => props.module.comments,
  () => props.clave,
  () => void load(),
)

watch(filter, () => void load())
onMounted(() => void load())
</script>

<template>
  <div class="admin-stack">
    <AdminPane :title="copy.adminTitle" :lead="copy.adminLead" :count="counts.en_revision">
      <template #actions>
        <Button size="sm" variant="ghost" :disabled="loading" @click="load">{{ copy.reload }}</Button>
      </template>
      <FilterPills v-model="filter" :pills="pills" :aria-label="copy.filterAria" />
      <p v-if="!comments.length && !loading" class="admin-empty">{{ copy.adminEmpty }}</p>
      <ul v-else class="admin-list" :aria-busy="loading">
        <li v-for="item in comments" :key="item.id" class="admin-list__item">
          <div class="admin-list__main">
            <strong>{{ item.authorAlias }}</strong>
            <span class="admin-list__meta">
              {{ copy.memoryOf(item.memoryTitle) }} · {{ formatCommentDate(item.createdAt) }}
            </span>
            <div class="admin-list__chips">
              <Chip :tone="statusTone(item.status)">{{ copy.statusLabels[item.status] }}</Chip>
              <Chip v-if="item.isPinned" tone="realizado">{{ copy.pinned }}</Chip>
              <Chip v-if="item.parentId" tone="realizado">{{ copy.replyTo }}</Chip>
              <Chip v-if="item.likes" tone="realizado">{{ copy.likes(item.likes) }}</Chip>
            </div>
            <p class="admin-list__text">{{ item.body }}</p>
          </div>
          <div class="admin-list__actions">
            <Button
              v-for="action in modActionsFor(item)"
              :key="action"
              size="sm"
              :variant="action === 'approve' ? 'primary' : action === 'remove' ? 'danger' : 'ghost'"
              :disabled="busy === item.id"
              @click="run(action, item)"
            >
              {{ modActionLabel(action, item) }}
            </Button>
          </div>
        </li>
      </ul>
    </AdminPane>

    <MemoryCommentRemoveModal
      :open="Boolean(removing)"
      :busy="Boolean(busy)"
      @cancel="removing = null"
      @confirm="confirmRemove"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  MEMORY_COMMENT_LIMITS,
  MEMORY_COMMENTS_MOD_COPY,
  RIDES_MEMORIES_COPY,
} from '@modules/rides/constants/copy.ts'
import {
  applyMemoryCommentLike,
  sortMemoryComments,
  threadMemoryComments,
  type MemoryComment,
} from '@modules/rides/domain/entities/MemoryComment.ts'
import type { RidesModule } from '@modules/rides/composition.ts'
import MemoryCommentRemoveModal from '@modules/rides/presentation/MemoryCommentRemoveModal.vue'
import { formatCommentDate } from '@modules/rides/presentation/memoryCommentView.ts'
import { modActionLabel, modActionsFor, useCommentModeration } from '@modules/rides/presentation/useCommentModeration.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import Button from '@ui/Button.vue'
import Comment from '@ui/Comment.vue'
import CommentReplies from '@ui/CommentReplies.vue'
import Field from '@ui/Field.vue'
import Textarea from '@ui/Textarea.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: RidesModule
  memoryId: string
  /** Sesión de quien modera comunidad en modo edición; vacía = vista normal. */
  moderateClave?: string
}>()

const copy = RIDES_MEMORIES_COPY
const modCopy = MEMORY_COMMENTS_MOD_COPY

const comments = ref<readonly MemoryComment[]>([])
const body = ref('')
const replyTo = ref<MemoryComment | null>(null)
const replyBody = ref('')
const sending = ref(false)
const liking = ref<string | null>(null)
const signedIn = ref(props.module.comments.hasSession())

const moderating = computed(() => Boolean(props.moderateClave))
const threads = computed(() => threadMemoryComments(sortMemoryComments(comments.value)))

async function load(): Promise<void> {
  const memoryId = props.memoryId
  signedIn.value = props.module.comments.hasSession()
  const result = props.moderateClave
    ? await props.module.comments
        .listOperator({ memoryId }, props.moderateClave)
        .then((res) => (res.ok ? { ok: true as const, value: res.value.comments } : res))
    : await props.module.comments.list(memoryId)
  if (memoryId !== props.memoryId) return
  if (!result.ok) {
    comments.value = []
    if (props.moderateClave) showToast(result.error.message || modCopy.loadFail, 'bad')
    return
  }
  comments.value = result.value
}

watch(
  () => [props.memoryId, props.moderateClave],
  () => {
    comments.value = []
    replyTo.value = null
    void load()
  },
  { immediate: true },
)

function validDraft(text: string): boolean {
  if (!text.trim()) {
    showToast(copy.commentEmpty, 'warn')
    return false
  }
  if (text.trim().length > MEMORY_COMMENT_LIMITS.BODY_MAX) {
    showToast(copy.commentTooLong(MEMORY_COMMENT_LIMITS.BODY_MAX), 'warn')
    return false
  }
  return true
}

async function send(text: string, parentId?: string): Promise<boolean> {
  if (sending.value) return false
  if (!props.module.comments.hasSession()) {
    showToast(copy.commentNeedAccount, 'warn')
    return false
  }
  if (!validDraft(text)) return false
  sending.value = true
  const result = await props.module.comments.post(props.memoryId, text.trim(), parentId)
  sending.value = false
  if (!result.ok) {
    showToast(result.error.message || copy.commentFail, 'bad')
    return false
  }
  showToast(copy.commentSent, 'ok')
  await load()
  return true
}

async function sendComment(): Promise<void> {
  if (await send(body.value)) body.value = ''
}

async function sendReply(): Promise<void> {
  const parent = replyTo.value
  if (!parent) return
  if (await send(replyBody.value, parent.id)) {
    replyBody.value = ''
    replyTo.value = null
  }
}

function openReply(comment: MemoryComment): void {
  if (!props.module.comments.hasSession()) {
    showToast(copy.commentNeedAccount, 'warn')
    return
  }
  replyTo.value = replyTo.value?.id === comment.id ? null : comment
  replyBody.value = ''
}

async function toggleLike(comment: MemoryComment): Promise<void> {
  if (liking.value) return
  if (!props.module.comments.hasSession()) {
    showToast(copy.likeNeedAccount, 'warn')
    return
  }
  const before = comments.value
  const optimistic = { liked: !comment.liked, likes: Math.max(0, comment.likes + (comment.liked ? -1 : 1)) }
  comments.value = applyMemoryCommentLike(before, comment.id, optimistic)
  liking.value = comment.id
  const result = await props.module.comments.like(comment.id)
  liking.value = null
  if (!result.ok) {
    comments.value = before
    showToast(result.error.message || copy.likeFail, 'bad')
    return
  }
  comments.value = applyMemoryCommentLike(comments.value, comment.id, result.value)
}

const { busy, removing, run, confirmRemove } = useCommentModeration(
  () => props.module.comments,
  () => props.moderateClave ?? '',
  () => void load(),
)

function statusNote(comment: MemoryComment): string {
  if (comment.status === 'publicado') return ''
  if (moderating.value) return modCopy.statusLabels[comment.status]
  return comment.mine ? copy.commentPending : ''
}
</script>

<template>
  <div class="memory-comments">
    <p v-if="moderating" class="memory-comments__mod meta-text">
      <strong>{{ modCopy.liveHeading }}</strong> · {{ modCopy.liveLead }}
    </p>

    <ul v-if="threads.length" class="comment-list memory-comments__list">
      <li v-for="thread in threads" :key="thread.comment.id">
        <Comment
          :author="thread.comment.authorAlias || copy.commentAuthorFallback"
          :body="thread.comment.body"
          :time="formatCommentDate(thread.comment.createdAt)"
          :pinned="thread.comment.isPinned"
          :pinned-label="copy.commentPinned"
          :class="{ 'memory-comments__item--muted': thread.comment.status !== 'publicado' }"
        >
          <template v-if="statusNote(thread.comment)" #head>
            <span class="memory-comments__status" :data-status="thread.comment.status">
              {{ statusNote(thread.comment) }}
            </span>
          </template>
          <template #actions>
            <button
              v-if="thread.comment.status === 'publicado'"
              type="button"
              class="memory-comments__like"
              :class="{ 'is-on': thread.comment.liked }"
              :aria-pressed="thread.comment.liked"
              :aria-label="copy.likeAria(thread.comment.likes, thread.comment.liked)"
              :disabled="liking === thread.comment.id"
              @click="toggleLike(thread.comment)"
            >
              <span aria-hidden="true">{{ thread.comment.liked ? '♥' : '♡' }}</span>
              {{ thread.comment.likes || copy.like }}
            </button>
            <button
              v-if="thread.comment.status === 'publicado'"
              type="button"
              :aria-expanded="replyTo?.id === thread.comment.id"
              @click="openReply(thread.comment)"
            >
              {{ copy.reply }}
            </button>
            <template v-if="moderating">
              <button
                v-for="action in modActionsFor(thread.comment)"
                :key="action"
                type="button"
                class="memory-comments__mod-btn"
                :class="{ 'memory-comments__mod-btn--danger': action === 'remove' }"
                :disabled="busy === thread.comment.id"
                @click="run(action, thread.comment)"
              >
                {{ modActionLabel(action, thread.comment) }}
              </button>
            </template>
          </template>

          <form
            v-if="replyTo?.id === thread.comment.id"
            class="memory-comments__reply"
            @submit.prevent="sendReply"
          >
            <Field :label="copy.replyLabel(thread.comment.authorAlias || copy.commentAuthorFallback)">
              <Textarea v-model="replyBody" :maxlength="MEMORY_COMMENT_LIMITS.BODY_MAX" />
            </Field>
            <div class="memory-comments__actions">
              <Button type="submit" size="sm" :disabled="sending">{{ copy.replySend }}</Button>
              <Button size="sm" variant="ghost" @click="replyTo = null">{{ copy.replyCancel }}</Button>
            </div>
          </form>

          <CommentReplies v-if="thread.replies.length">
            <li v-for="reply in thread.replies" :key="reply.id">
              <Comment
                :author="reply.authorAlias || copy.commentAuthorFallback"
                :body="reply.body"
                :time="formatCommentDate(reply.createdAt)"
                :class="{ 'memory-comments__item--muted': reply.status !== 'publicado' }"
              >
                <template v-if="statusNote(reply)" #head>
                  <span class="memory-comments__status" :data-status="reply.status">{{ statusNote(reply) }}</span>
                </template>
                <template #actions>
                  <button
                    v-if="reply.status === 'publicado'"
                    type="button"
                    class="memory-comments__like"
                    :class="{ 'is-on': reply.liked }"
                    :aria-pressed="reply.liked"
                    :aria-label="copy.likeAria(reply.likes, reply.liked)"
                    :disabled="liking === reply.id"
                    @click="toggleLike(reply)"
                  >
                    <span aria-hidden="true">{{ reply.liked ? '♥' : '♡' }}</span>
                    {{ reply.likes || copy.like }}
                  </button>
                  <template v-if="moderating">
                    <button
                      v-for="action in modActionsFor(reply)"
                      :key="action"
                      type="button"
                      class="memory-comments__mod-btn"
                      :class="{ 'memory-comments__mod-btn--danger': action === 'remove' }"
                      :disabled="busy === reply.id"
                      @click="run(action, reply)"
                    >
                      {{ modActionLabel(action, reply) }}
                    </button>
                  </template>
                </template>
              </Comment>
            </li>
          </CommentReplies>
        </Comment>
      </li>
    </ul>
    <p v-else class="meta-text">{{ copy.commentsEmpty }}</p>

    <form class="memory-comments__form" @submit.prevent="sendComment">
      <Field :label="copy.commentLabel">
        <Textarea v-model="body" :maxlength="MEMORY_COMMENT_LIMITS.BODY_MAX" />
      </Field>
      <div class="memory-comments__actions">
        <Button type="submit" size="sm" :disabled="sending">{{ copy.commentSend }}</Button>
        <Button v-if="!signedIn" size="sm" variant="ghost" :to="APP_PATHS.ENTRAR">
          {{ copy.commentLogin }}
        </Button>
      </div>
    </form>

    <MemoryCommentRemoveModal
      :open="Boolean(removing)"
      :busy="Boolean(busy)"
      @cancel="removing = null"
      @confirm="confirmRemove"
    />
  </div>
</template>

<style scoped>
.memory-comments,
.memory-comments__form,
.memory-comments__reply {
  display: grid;
  gap: 12px;
  min-width: 0;
}

.memory-comments__list {
  min-width: 0;
}

.memory-comments__mod {
  margin: 0;
  padding: 8px 12px;
  border: 1px dashed rgba(72, 180, 252, 0.4);
  border-radius: 8px;
}

.memory-comments__reply {
  margin-top: 12px;
  padding: 12px;
  border-radius: 8px;
  background: var(--navy, #001028);
}

.memory-comments__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.memory-comments__status {
  font-size: 11px;
  color: #e8c060;
}

.memory-comments__status[data-status='oculto'],
.memory-comments__status[data-status='rechazado'] {
  color: #f07a7a;
}

.memory-comments__item--muted {
  opacity: 0.72;
}

.memory-comments :deep(.comment-item__actions) {
  flex-wrap: wrap;
  align-items: center;
}

.memory-comments :deep(.comment-item__actions button:disabled) {
  opacity: 0.5;
  cursor: default;
}

.memory-comments__like {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.memory-comments__like span {
  font-size: 14px;
  line-height: 1;
}

.memory-comments__like.is-on {
  color: var(--cyan, #48b4fc) !important;
}

.memory-comments__mod-btn {
  color: var(--cyan, #48b4fc) !important;
  font-weight: 600;
}

.memory-comments__mod-btn--danger {
  color: #f07a7a !important;
}
</style>

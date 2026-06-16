"use client";

import AnnotationDeleteDialog from "@/components/match-annotator/components/annotations/AnnotationDeleteDialog";
import AnnotationForm from "@/components/match-annotator/components/annotations/AnnotationForm";
import AnnotationList from "@/components/match-annotator/components/annotations/AnnotationList";
import AnnotationSummaryPanel from "@/components/match-annotator/components/annotations/AnnotationSummaryPanel";
import AnnotationTimeline from "@/components/match-annotator/components/annotations/AnnotationTimeline";
import BlueAllianceModal from "@/components/match-annotator/components/blue-alliance/BlueAllianceModal";
import LocalVideoReuploadBanner from "@/components/match-annotator/components/LocalVideoReuploadBanner";
import MatchAnnotatorVideoPanel from "@/components/match-annotator/components/MatchAnnotatorVideoPanel";
import AnnotatedVideoDeleteDialog from "@/components/match-annotator/components/AnnotatedVideoDeleteDialog";
import AnnotatedVideoSelect from "@/components/match-annotator/components/AnnotatedVideoSelect";
import VideoSourceSection from "@/components/match-annotator/components/VideoSourceSection";
import type useMatchAnnotatorState from "@/components/match-annotator/hooks/useMatchAnnotatorState";
import Hero from "@/components/common/Hero";
import { Button } from "@/components/ui/button";

type MatchAnnotatorState = ReturnType<typeof useMatchAnnotatorState>;

type MatchAnnotatorLayoutProps = {
  state: MatchAnnotatorState;
};

export default function MatchAnnotatorLayout({
  state,
}: MatchAnnotatorLayoutProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Hero text="Match Annotator" />
        <div className="flex flex-wrap items-center gap-2">
          {state.canDeleteAnnotatedVideo ? (
            <Button
              type="button"
              variant="destructive"
              onClick={state.requestDeleteAnnotatedVideo}
            >
              Delete video
            </Button>
          ) : null}
          <AnnotatedVideoSelect
            annotatedVideoId={state.annotatedVideoId}
            videos={state.savedVideos}
            onSelect={state.handleSelectAnnotatedVideo}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
        <section className="flex flex-col gap-5 rounded-[28px] border border-border bg-card p-6">
          <VideoSourceSection
            error={state.error}
            onLocalFileSelect={state.handleLocalFileSelect}
            onOpenBlueAlliance={state.openBlueAlliance}
          />

          {state.pendingLocalReload ? (
            <LocalVideoReuploadBanner
              localLabel={state.annotatedVideo?.localLabel}
              onLocalFileSelect={state.handleLocalFileSelect}
            />
          ) : null}

          <MatchAnnotatorVideoPanel
            isHtml5={state.isHtml5}
            isYouTube={state.isYouTube}
            loadedUrl={state.loadedUrl}
            videoRef={state.videoRef}
            youtubeContainerRef={state.youtubeContainerRef}
          />

          <AnnotationTimeline
            annotations={state.annotations}
            duration={state.duration}
            currentTime={state.currentTime}
            activeAnnotationId={state.activeAnnotationId}
            onSeek={state.seekTo}
          />

          {state.annotatedVideoId ? (
            <AnnotationSummaryPanel
              summary={state.annotationSummary}
              isGenerating={state.isGeneratingSummary}
              isSaving={state.isSavingSummary}
              isDeleting={state.isDeletingSummary}
              isSaved={state.isSummarySaved}
              canGenerate={state.annotations.length > 0}
              annotationCount={state.annotations.length}
              onGenerate={() => {
                void state.handleGenerateSummary();
              }}
              onSave={() => {
                void state.handleSaveSummary();
              }}
              onDelete={() => {
                void state.handleDeleteSummary();
              }}
              onDismiss={state.handleDismissSummary}
            />
          ) : null}
        </section>

        <section className="flex flex-col-reverse gap-4 lg:flex-col">
          <AnnotationList
            annotations={state.annotations}
            activeAnnotationId={state.activeAnnotationId}
            editingAnnotationId={state.annotationForm.editingId}
            expandedAnnotationId={state.expandedAnnotationId}
            currentUserSubject={state.currentUserSubject}
            repliesByAnnotationId={state.repliesByAnnotationId}
            replyTextByAnnotationId={state.replyTextByAnnotationId}
            editingReplyId={state.editingReplyId}
            isSubmittingReply={state.isSubmittingReply}
            onToggleExpand={state.handleToggleExpand}
            onSeek={state.seekTo}
            onEdit={(annotation) => {
              if (state.annotationForm.editingId === annotation._id) {
                state.annotationForm.resetForm();
                return;
              }

              state.annotationForm.startEditing({
                id: annotation._id,
                text: annotation.text,
                startTimeSeconds: annotation.startTimeSeconds,
                endTimeSeconds: annotation.endTimeSeconds,
              });
            }}
            onDelete={state.requestDeleteAnnotation}
            onReplyTextChange={state.handleReplyTextChange}
            onSubmitReply={state.handleSubmitReply}
            onCancelReplyEdit={state.setEditingReplyId}
            onEditReply={state.handleEditReply}
            onDeleteReply={state.handleDeleteReply}
          />

          <AnnotationForm
            text={state.annotationForm.text}
            mode={state.annotationForm.mode}
            markIn={state.annotationForm.markIn}
            markOut={state.annotationForm.markOut}
            editingId={state.annotationForm.editingId}
            resolvedStartTime={state.annotationForm.resolvedStartTime}
            resolvedEndTime={state.annotationForm.resolvedEndTime}
            isSubmitting={state.isSubmittingAnnotation}
            onTextChange={state.annotationForm.setText}
            onModeChange={state.annotationForm.setMode}
            onMarkIn={state.annotationForm.captureMarkIn}
            onMarkOut={state.annotationForm.captureMarkOut}
            onUseCurrentTime={state.annotationForm.useCurrentTime}
            onSubmit={state.handleSubmitAnnotation}
            onCancelEdit={state.annotationForm.resetForm}
          />
        </section>
      </div>

      <AnnotatedVideoDeleteDialog
        open={state.annotatedVideoPendingDelete}
        videoTitle={state.annotatedVideo?.title}
        isDeleting={state.isDeletingAnnotatedVideo}
        onOpenChange={(open) => {
          if (!open) state.cancelDeleteAnnotatedVideo();
        }}
        onConfirm={() => {
          void state.confirmDeleteAnnotatedVideo();
        }}
      />

      <AnnotationDeleteDialog
        open={state.annotationPendingDelete !== null}
        timeLabel={state.annotationPendingDelete?.timeLabel}
        annotationText={state.annotationPendingDelete?.text}
        onOpenChange={(open) => {
          if (!open) state.cancelDeleteAnnotation();
        }}
        onConfirm={() => {
          void state.confirmDeleteAnnotation();
        }}
      />

      <BlueAllianceModal
        open={state.blueAllianceOpen}
        step={state.blueAllianceStep}
        events={state.tbaEvents}
        matches={state.tbaMatches}
        selectedEvent={state.selectedTbaEvent}
        selectedMatch={state.selectedTbaMatch}
        isLoadingEvents={state.isLoadingTbaEvents}
        isLoadingMatches={state.isLoadingTbaMatches}
        eventSearchQuery={state.eventSearchQuery}
        matchSearchQuery={state.matchSearchQuery}
        onOpenChange={state.setBlueAllianceOpen}
        onEventSearchQueryChange={state.setEventSearchQuery}
        onMatchSearchQueryChange={state.setMatchSearchQuery}
        onSelectEvent={state.handleSelectTbaEvent}
        onSelectMatch={state.handleSelectTbaMatch}
        onSelectVideo={state.handleSelectTbaVideo}
        onBackToEvents={() => {
          state.setBlueAllianceStep("event");
          state.setSelectedTbaEvent(null);
          state.setSelectedTbaMatch(null);
          state.setMatchSearchQuery("");
        }}
        onBackToMatches={() => {
          state.setBlueAllianceStep("match");
          state.setSelectedTbaMatch(null);
        }}
      />
    </div>
  );
}

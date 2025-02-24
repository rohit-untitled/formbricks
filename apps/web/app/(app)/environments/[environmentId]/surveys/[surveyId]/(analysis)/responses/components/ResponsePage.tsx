"use client";
import CustomFilter from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/components/CustomFilter";
import SummaryHeader from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/components/SummaryHeader";
import SurveyResultsTabs from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/components/SurveyResultsTabs";
import ResponseTimeline from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/responses/components/ResponseTimeline";
import ContentWrapper from "@formbricks/ui/ContentWrapper";
import { useResponseFilter } from "@/app/(app)/environments/[environmentId]/components/ResponseFilterContext";
import { getFilterResponses } from "@/app/lib/surveys/surveys";
import { TResponse } from "@formbricks/types/v1/responses";
import { TSurvey } from "@formbricks/types/v1/surveys";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { TEnvironment } from "@formbricks/types/v1/environment";
import { TProduct } from "@formbricks/types/v1/product";
import { TTag } from "@formbricks/types/v1/tags";
import { TProfile } from "@formbricks/types/v1/profile";

interface ResponsePageProps {
  environment: TEnvironment;
  survey: TSurvey;
  surveyId: string;
  responses: TResponse[];
  surveyBaseUrl: string;
  product: TProduct;
  profile: TProfile;
  environmentTags: TTag[];
}

const ResponsePage = ({
  environment,
  survey,
  surveyId,
  responses,
  surveyBaseUrl,
  product,
  profile,
  environmentTags,
}: ResponsePageProps) => {
  const { selectedFilter, dateRange, resetState } = useResponseFilter();

  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams?.get("referer")) {
      resetState();
    }
  }, [searchParams]);

  // get the filtered array when the selected filter value changes
  const filterResponses: TResponse[] = useMemo(() => {
    return getFilterResponses(responses, selectedFilter, survey, dateRange);
  }, [selectedFilter, responses, survey, dateRange]);
  return (
    <ContentWrapper>
      <SummaryHeader
        environment={environment}
        survey={survey}
        surveyId={surveyId}
        surveyBaseUrl={surveyBaseUrl}
        product={product}
        profile={profile}
      />
      <CustomFilter
        environmentTags={environmentTags}
        responses={filterResponses}
        survey={survey}
        totalResponses={responses}
      />
      <SurveyResultsTabs activeId="responses" environmentId={environment.id} surveyId={surveyId} />
      <ResponseTimeline
        environment={environment}
        surveyId={surveyId}
        responses={filterResponses}
        survey={survey}
        profile={profile}
        environmentTags={environmentTags}
      />
    </ContentWrapper>
  );
};

export default ResponsePage;

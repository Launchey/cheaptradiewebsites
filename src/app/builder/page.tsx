"use client";

import { useReducer, useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StepIndicator from "@/components/builder/StepIndicator";
import Step1UrlInput from "@/components/builder/Step1UrlInput";
import Step2BusinessInfo from "@/components/builder/Step2BusinessInfo";
import Step3Preview from "@/components/builder/Step3Preview";
import Step4Checkout from "@/components/builder/Step4Checkout";
import SuccessScreen from "@/components/builder/SuccessScreen";
import { TEMPLATE_PRESETS } from "@/lib/constants";
import type { BuilderState, BusinessInfo, ExtractedDesignTokens, ExtractedContent } from "@/lib/types";

type Action =
  | { type: "SET_DESIGN_TOKENS"; tokens: ExtractedDesignTokens; prefill?: Partial<BusinessInfo>; extractedContent?: ExtractedContent }
  | { type: "SET_BUSINESS_INFO"; info: BusinessInfo }
  | { type: "SET_GENERATING" }
  | { type: "SET_PREVIEW"; siteId: string; previewUrl: string }
  | { type: "SET_REGENERATING" }
  | { type: "SET_PROCESSING_PAYMENT" }
  | { type: "SET_DEPLOYED"; deployedUrl: string }
  | { type: "SET_ERROR"; error: string }
  | { type: "GO_TO_STEP"; step: 1 | 2 | 3 | 4 }
  | { type: "RESET" };

const initialState: BuilderState = {
  step: 1,
  referenceUrl: "",
  businessInfo: {
    businessName: "",
    tradeType: "builder",
    location: "",
    region: "",
    phone: "",
    email: "",
    services: [],
    aboutText: "",
  },
};

function reducer(state: BuilderState, action: Action): BuilderState {
  switch (action.type) {
    case "SET_DESIGN_TOKENS":
      return {
        ...state,
        step: 2,
        designTokens: action.tokens,
        extractedContent: action.extractedContent,
        businessInfo: action.prefill
          ? { ...state.businessInfo, ...action.prefill }
          : state.businessInfo,
      };
    case "SET_BUSINESS_INFO":
      return { ...state, businessInfo: action.info, isLoading: true };
    case "SET_GENERATING":
      return { ...state, isLoading: true, error: undefined };
    case "SET_PREVIEW":
      return {
        ...state,
        step: 3,
        siteId: action.siteId,
        previewUrl: action.previewUrl,
        isLoading: false,
      };
    case "SET_REGENERATING":
      return { ...state, isLoading: true };
    case "SET_PROCESSING_PAYMENT":
      return { ...state, isLoading: true };
    case "SET_DEPLOYED":
      return {
        ...state,
        step: 4,
        paymentComplete: true,
        isLoading: false,
        previewUrl: action.deployedUrl,
      };
    case "SET_ERROR":
      return { ...state, error: action.error, isLoading: false };
    case "GO_TO_STEP":
      return { ...state, step: action.step, isLoading: false, error: undefined };
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-[3px] border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" /></div>}>
      <BuilderContent />
    </Suspense>
  );
}

function BuilderContent() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const searchParams = useSearchParams();
  const [initialUrl, setInitialUrl] = useState("");
  const [deployedUrl, setDeployedUrl] = useState("");

  // Check for template or URL query params
  useEffect(() => {
    const template = searchParams.get("template");
    const url = searchParams.get("url");

    if (template && TEMPLATE_PRESETS[template]) {
      dispatch({
        type: "SET_DESIGN_TOKENS",
        tokens: TEMPLATE_PRESETS[template].designTokens,
      });
    } else if (url) {
      setInitialUrl(url);
    }
  }, [searchParams]);

  const handleStep1Complete = useCallback(
    (tokens: ExtractedDesignTokens, prefill?: Partial<BusinessInfo>, extractedContent?: ExtractedContent) => {
      dispatch({ type: "SET_DESIGN_TOKENS", tokens, prefill, extractedContent });
    },
    []
  );

  const handleStep2Complete = useCallback(
    async (info: BusinessInfo) => {
      dispatch({ type: "SET_BUSINESS_INFO", info });

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessInfo: info,
            designTokens: state.designTokens,
            extractedContent: state.extractedContent,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          dispatch({ type: "SET_ERROR", error: err.error || "Something went wrong." });
          return;
        }

        // Read the SSE stream
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          dispatch({ type: "SET_ERROR", error: "Something went wrong. Please try again." });
          return;
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          const lines = text.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === "complete") {
                  dispatch({
                    type: "SET_PREVIEW",
                    siteId: data.siteId,
                    previewUrl: data.previewUrl,
                  });
                } else if (data.type === "error") {
                  dispatch({ type: "SET_ERROR", error: data.error });
                }
              } catch {
                // Skip malformed JSON lines
              }
            }
          }
        }
      } catch {
        dispatch({
          type: "SET_ERROR",
          error: "Something went wrong building your website. Please try again.",
        });
      }
    },
    [state.designTokens, state.extractedContent]
  );

  const handleRequestChanges = useCallback(
    async (feedback: string) => {
      dispatch({ type: "SET_REGENERATING" });

      const updatedInfo = {
        ...state.businessInfo,
        aboutText: `${state.businessInfo.aboutText}\n\nAdditional requirements: ${feedback}`,
      };

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessInfo: updatedInfo,
            designTokens: state.designTokens,
            extractedContent: state.extractedContent,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          dispatch({ type: "SET_ERROR", error: err.error || "Something went wrong." });
          return;
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          dispatch({ type: "SET_ERROR", error: "Something went wrong. Please try again." });
          return;
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          const lines = text.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === "complete") {
                  dispatch({
                    type: "SET_PREVIEW",
                    siteId: data.siteId,
                    previewUrl: data.previewUrl,
                  });
                } else if (data.type === "error") {
                  dispatch({ type: "SET_ERROR", error: data.error });
                }
              } catch {
                // Skip malformed JSON
              }
            }
          }
        }
      } catch {
        dispatch({
          type: "SET_ERROR",
          error: "Something went wrong. Please try again.",
        });
      }
    },
    [state.businessInfo, state.designTokens, state.extractedContent]
  );

  const handlePay = useCallback(async () => {
    if (!state.siteId) return;

    dispatch({ type: "SET_PROCESSING_PAYMENT" });

    try {
      // Process payment (placeholder)
      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: state.siteId }),
      });

      if (!checkoutRes.ok) {
        const err = await checkoutRes.json();
        dispatch({ type: "SET_ERROR", error: err.error });
        return;
      }

      // Deploy the site
      const deployRes = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: state.siteId }),
      });

      if (!deployRes.ok) {
        const err = await deployRes.json();
        dispatch({ type: "SET_ERROR", error: err.error });
        return;
      }

      const { deployedUrl: url } = await deployRes.json();
      setDeployedUrl(url);
      dispatch({ type: "SET_DEPLOYED", deployedUrl: url });
    } catch {
      dispatch({
        type: "SET_ERROR",
        error: "Something went wrong with the payment. Please try again.",
      });
    }
  }, [state.siteId]);

  // Show error
  const errorBanner = state.error && (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[var(--radius-md)] text-red-700 text-sm">
      {state.error}
    </div>
  );

  // If deployed, show success screen
  if (state.paymentComplete && deployedUrl) {
    return (
      <div className="py-8">
        <SuccessScreen
          deployedUrl={deployedUrl}
          businessName={state.businessInfo.businessName}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Step indicator */}
      <div className="pt-2">
        <StepIndicator currentStep={state.step} />
      </div>

      {errorBanner}

      {/* Current step */}
      <div className="py-4">
        {state.step === 1 && (
          <Step1UrlInput
            onComplete={handleStep1Complete}
            initialUrl={initialUrl}
          />
        )}

        {state.step === 2 && (
          <Step2BusinessInfo
            onComplete={handleStep2Complete}
            onBack={() => dispatch({ type: "GO_TO_STEP", step: 1 })}
            prefill={state.businessInfo}
            isLoading={state.isLoading}
          />
        )}

        {state.step === 3 && state.siteId && state.previewUrl && (
          <Step3Preview
            siteId={state.siteId}
            previewUrl={state.previewUrl}
            onGetWebsite={() => dispatch({ type: "GO_TO_STEP", step: 4 })}
            onRequestChanges={handleRequestChanges}
            onStartOver={() => dispatch({ type: "RESET" })}
            isRegenerating={state.isLoading}
          />
        )}

        {state.step === 4 && state.siteId && (
          <Step4Checkout
            businessInfo={state.businessInfo}
            siteId={state.siteId}
            onPay={handlePay}
            onBack={() => dispatch({ type: "GO_TO_STEP", step: 3 })}
            isProcessing={state.isLoading}
          />
        )}
      </div>
    </div>
  );
}

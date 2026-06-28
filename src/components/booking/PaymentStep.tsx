import { useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";

type PaymentStepProps = {
  depositLabel: string;
  onSuccess: () => void;
  onBack: () => void;
};

export default function PaymentStep({ depositLabel, onSuccess, onBack }: PaymentStepProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError("");

    const { error: payError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/book` },
      redirect: "if_required",
    });

    if (payError) {
      setError(payError.message ?? "Payment could not be completed. Please try again.");
      setSubmitting(false);
      return;
    }

    onSuccess();
  };

  return (
    <form onSubmit={handlePay}>
      <p className="curly-label mb-2">Secure Deposit</p>
      <p className="text-[13px] text-curly-muted mb-5 leading-relaxed">
        Your {depositLabel} deposit confirms the appointment and is applied to your final bill.
      </p>

      <PaymentElement options={{ layout: "tabs" }} />

      {error && (
        <p className="text-sm text-red-700 mt-4" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={!stripe || submitting} className="curly-btn-gold w-full mt-6">
        {submitting ? "Processing…" : `Pay ${depositLabel} Deposit`}
      </button>
      <button
        type="button"
        onClick={onBack}
        disabled={submitting}
        className="mt-3 w-full text-[11px] tracking-[0.22em] uppercase text-curly-muted hover:text-curly-accent-dark transition-colors disabled:opacity-40"
      >
        Back
      </button>
      <p className="text-[11px] text-curly-muted text-center mt-4 leading-relaxed">
        Payments are securely processed by Stripe. We never see your card details.
      </p>
    </form>
  );
}

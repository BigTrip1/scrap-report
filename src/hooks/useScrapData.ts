import { useState, useEffect, useRef } from "react";
import { ScrapData } from "@/types/scrap";
import { useCurrency } from "@/contexts/CurrencyContext";

export interface UseScrapDataProps {
  facility: string;
  dateRange?: string;
  startDate?: string;
  endDate?: string;
  currency: string;
  skip?: boolean;
}

export function useScrapData({
  facility,
  dateRange,
  startDate,
  endDate,
  currency,
  skip = false,
}: UseScrapDataProps) {
  const [data, setData] = useState<ScrapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (skip) {
      return;
    }

    const fetchData = async () => {
      try {
        // Abort previous request if it exists
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        setLoading(true);
        setError(null);

        console.log("useScrapData fetching with params: ", {
          facility,
          startDate,
          endDate,
          currency,
        });

        const response = await fetch(
          `/api/scraps?facility=${facility}&startDate=${startDate}&endDate=${endDate}&currency=${currency}`,
          {
            signal: abortController.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("useScrapData received response: ", result);
        setData(result);
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === "AbortError") {
            console.log("Fetch aborted");
            return;
          }
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [facility, startDate, endDate, currency, skip]);

  return { data, loading, error };
}

// Helper functions for trend calculations
function calculateTrend(current: number, previous: number): string {
  if (!previous) return "";
  const diff = current - previous;
  return diff >= 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2);
}

function calculatePercentageChange(current: number, previous: number): number {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}

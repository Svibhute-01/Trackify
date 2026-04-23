import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaSearch, FaArrowRight, FaMapMarkerAlt, FaClock, FaBus } from "react-icons/fa";
import API from "../../api/api";
import Navbar from "../../components/Navbar";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import StatusBadge from "../../components/ui/StatusBadge";
import styles from "./Search.module.css";

function formatDate(d) {
  return new Date(d).toLocaleDateString([], {
    weekday: "short", month: "short", day: "numeric",
  });
}
function formatTime(d) {
  return new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function isToday(d) {
  const today = new Date();
  const date = new Date(d);
  return today.toDateString() === date.toDateString();
}

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const runSearch = async (qFrom, qTo) => {
    if (!qFrom.trim() && !qTo.trim()) {
      setError("Enter a starting point or destination");
      return;
    }
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (qFrom.trim()) params.set("from", qFrom.trim());
      if (qTo.trim()) params.set("to", qTo.trim());
      const res = await API.get(`/schedules/search?${params.toString()}`);
      setResults(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("from") || searchParams.get("to")) {
      runSearch(searchParams.get("from") || "", searchParams.get("to") || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from.trim()) params.set("from", from.trim());
    if (to.trim()) params.set("to", to.trim());
    setSearchParams(params, { replace: true });
    runSearch(from, to);
  };

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Find your bus</h1>
            <p className={styles.subtitle}>
              Showing today's and upcoming schedules. Partial matches work — try "mum" for "Mumbai".
            </p>
          </header>

          <form className={styles.searchBar} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <FaMapMarkerAlt className={styles.fieldIcon} />
              <input
                type="text"
                placeholder="From"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <FaArrowRight className={styles.divider} />
            <div className={styles.field}>
              <FaMapMarkerAlt className={styles.fieldIcon} />
              <input
                type="text"
                placeholder="To"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <Button type="submit" loading={loading} icon={!loading && <FaSearch />}>
              Search
            </Button>
          </form>

          {error && <div className={styles.alert}>{error}</div>}

          {loading ? (
            <div className={styles.center}>
              <Spinner size={28} color="var(--color-primary)" />
            </div>
          ) : searched && results.length === 0 ? (
            <Card>
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔍</div>
                <h3>No buses found</h3>
                <p>Try a different city or check spelling. Only today and upcoming trips are shown.</p>
                <Button variant="ghost" onClick={() => navigate("/")}>Back to home</Button>
              </div>
            </Card>
          ) : results.length > 0 ? (
            <>
              <p className={styles.count}>
                <strong>{results.length}</strong> bus{results.length === 1 ? "" : "es"} found
              </p>
              <div className={styles.list}>
                {results.map((s) => (
                  <article key={s._id} className={styles.resultCard}>
                    <div className={styles.left}>
                      <div className={styles.busLine}>
                        <FaBus className={styles.busIcon} />
                        <span className={styles.plate}>{s.bus?.numberPlate || "—"}</span>
                        {s.bus?.capacity && (
                          <span className={styles.capacity}>{s.bus.capacity} seats</span>
                        )}
                        <StatusBadge status={s.status} />
                      </div>

                      <div className={styles.routeLine}>
                        <span className={styles.city}>{s.route?.from}</span>
                        <FaArrowRight className={styles.routeArrow} />
                        <span className={styles.city}>{s.route?.to}</span>
                        {s.route?.routeCode && (
                          <span className={styles.code}>{s.route.routeCode}</span>
                        )}
                      </div>

                      {s.route?.distance && (
                        <div className={styles.meta}>
                          {s.route.distance} km
                          {s.route.duration ? ` · ${s.route.duration} min` : ""}
                          {s.route.stops?.length > 0 ? ` · ${s.route.stops.length} stops` : ""}
                        </div>
                      )}
                    </div>

                    <div className={styles.right}>
                      <div className={styles.dateRow}>
                        <FaClock className={styles.clockIcon} />
                        <span className={styles.date}>
                          {isToday(s.departureTime) ? "Today" : formatDate(s.departureTime)}
                        </span>
                      </div>
                      <div className={styles.times}>
                        <span className={styles.time}>{formatTime(s.departureTime)}</span>
                        <span className={styles.dash}>–</span>
                        <span className={styles.time}>{formatTime(s.arrivalTime)}</span>
                      </div>
                      {s.driver?.name && (
                        <div className={styles.driver}>Driver: {s.driver.name}</div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <Card>
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🚌</div>
                <h3>Search for a bus</h3>
                <p>Enter a starting point, destination, or both above to see available trips.</p>
              </div>
            </Card>
          )}
        </div>
      </main>
    </>
  );
};

export default Search;

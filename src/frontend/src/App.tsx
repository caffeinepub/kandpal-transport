import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Bus,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Clock,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Package,
  Phone,
  Shield,
  Star,
  Truck,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, type Variants, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "./hooks/useActor";

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const UNAVAILABLE_SEATS = [3, 7, 12, 15, 22, 28, 33, 38];
const TOTAL_SEATS = 40;
const ROWS = 10;

export default function App() {
  const { actor } = useActor();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [formState, setFormState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [distance, setDistance] = useState<string>("");
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const seatCount = selectedSeats.length > 0 ? selectedSeats.length : 1;
  const fare = distance
    ? Number(distance) *
      5 *
      (selectedSeats.length > 0 ? selectedSeats.length : 1)
    : 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navbarHeight = window.innerWidth >= 768 ? 80 : 64;
      const top =
        el.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const toggleSeat = (seatNum: number) => {
    if (UNAVAILABLE_SEATS.includes(seatNum)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatNum)
        ? prev.filter((s) => s !== seatNum)
        : [...prev, seatNum],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.message
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    setFormState("loading");
    try {
      await actor.submitInquiry(
        formData.name,
        formData.phone,
        formData.email,
        formData.message,
      );
      setFormState("success");
      toast.success("Inquiry submitted! We will contact you shortly.");
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch {
      setFormState("error");
      toast.error("Failed to submit. Please try again or call us directly.");
    }
  };

  const busFeatures = [
    { icon: <Shield className="w-5 h-5" />, label: "AC Sleeper" },
    { icon: <Star className="w-5 h-5" />, label: "Push-back Seats" },
    { icon: <Zap className="w-5 h-5" />, label: "USB Charging" },
    { icon: <MapPin className="w-5 h-5" />, label: "GPS Tracking" },
    { icon: <Bus className="w-5 h-5" />, label: "Experienced Drivers" },
    { icon: <Wifi className="w-5 h-5" />, label: "Comfortable Journey" },
  ];

  const cargoServices = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Full Truckload",
      desc: "Dedicated truck for your entire consignment — secure, swift, and cost-effective.",
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Part Load",
      desc: "Share space and reduce costs without compromising on delivery timelines.",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Express Delivery",
      desc: "Priority freight service for time-sensitive shipments across cities.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Pan India Coverage",
      desc: "Our fleet reaches every major city and tier-2 hub across the country.",
    },
  ];

  const navLinks = [
    { label: "Home", id: "hero", marker: "nav.home.link" },
    { label: "Luxury Bus", id: "luxury-bus", marker: "nav.luxury_bus.link" },
    {
      label: "Fare Calculator",
      id: "fare-calculator",
      marker: "nav.fare_calculator.link",
    },
    { label: "Cargo", id: "cargo", marker: "nav.cargo.link" },
    { label: "Contact", id: "contact", marker: "nav.contact.link" },
  ];

  // Build seat grid: rows of [A, B, aisle-gap, C, D]
  const seatRows = Array.from({ length: ROWS }, (_, rowIdx) => {
    const base = rowIdx * 4;
    return {
      row: rowIdx + 1,
      left: [base + 1, base + 2],
      right: [base + 3, base + 4],
    };
  });

  const getSeatState = (seatNum: number) => {
    if (seatNum > TOTAL_SEATS) return "empty";
    if (UNAVAILABLE_SEATS.includes(seatNum)) return "unavailable";
    if (selectedSeats.includes(seatNum)) return "selected";
    return "available";
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Toaster position="top-right" richColors />

      {/* ── NAVBAR ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-navy"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 min-w-0 shrink-0">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-gold shrink-0">
              <Bus className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-base md:text-xl font-bold gold-gradient-text tracking-tight whitespace-nowrap">
              Kandpal Transport
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.id}
                data-ocid={link.marker}
                onClick={() => scrollToSection(link.id)}
                className="font-heading text-xs xl:text-sm font-semibold text-foreground/70 hover:text-primary transition-colors duration-200 tracking-wide uppercase whitespace-nowrap"
              >
                {link.label}
              </button>
            ))}
            <Button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="bg-primary text-primary-foreground font-heading font-bold text-sm px-5 hover:bg-gold-light shadow-gold whitespace-nowrap shrink-0"
            >
              Book Now
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden text-foreground p-2 shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-card border-t border-border px-4 py-4"
            >
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <button
                    type="button"
                    key={link.id}
                    data-ocid={link.marker}
                    onClick={() => scrollToSection(link.id)}
                    className="text-left font-heading text-sm font-semibold text-foreground/80 hover:text-primary transition-colors py-2 uppercase tracking-wide"
                  >
                    {link.label}
                  </button>
                ))}
                <Button
                  type="button"
                  onClick={() => scrollToSection("contact")}
                  className="bg-primary text-primary-foreground font-heading font-bold w-full shadow-gold mt-1"
                >
                  Book Now
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO SECTION ── */}
      <section
        id="hero"
        data-ocid="hero.section"
        className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero_transport.dim_1400x700.jpg"
            alt="Kandpal Transport Hero"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/20" />
        </div>

        {/* Decorative glow elements */}
        <div className="absolute top-1/3 right-8 md:right-24 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-8 w-48 h-48 rounded-full bg-primary/8 blur-2xl pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 md:px-8 pt-24 md:pt-28 pb-20 md:pb-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div variants={fadeUpVariants} className="mb-5">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-heading font-bold uppercase tracking-widest">
                <Star className="w-3 h-3 fill-current shrink-0" />
                <span>Premium Transport Services</span>
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUpVariants}
              className="font-display text-5xl md:text-7xl xl:text-8xl font-bold leading-[1.1] mb-6"
            >
              <span className="gold-gradient-text block">Kandpal</span>
              <span className="text-foreground block">Transport</span>
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              className="text-base md:text-xl text-foreground/75 font-sans leading-relaxed mb-8 max-w-xl"
            >
              Your Trusted Travel &amp; Cargo Partner — Luxury buses, reliable
              freight, and on-time delivery across India.
            </motion.p>

            <motion.div
              variants={fadeUpVariants}
              className="flex flex-wrap gap-3 md:gap-4"
            >
              <Button
                type="button"
                onClick={() => scrollToSection("luxury-bus")}
                size="lg"
                className="bg-primary text-primary-foreground font-heading font-bold px-6 md:px-8 py-3 text-sm md:text-base shadow-gold hover:bg-gold-light transition-all duration-300"
              >
                <Bus className="w-4 h-4 md:w-5 md:h-5 mr-2 shrink-0" />
                Explore Luxury Bus
              </Button>
              <Button
                type="button"
                onClick={() => scrollToSection("cargo")}
                size="lg"
                variant="outline"
                className="border-primary/40 text-foreground font-heading font-bold px-6 md:px-8 py-3 text-sm md:text-base hover:bg-primary/10 hover:border-primary transition-all duration-300"
              >
                <Truck className="w-4 h-4 md:w-5 md:h-5 mr-2 shrink-0" />
                Cargo Services
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUpVariants}
              className="mt-10 md:mt-12 flex flex-wrap gap-6 md:gap-8"
            >
              {[
                { val: "10+", label: "Years Experience" },
                { val: "50,000+", label: "Happy Passengers" },
                { val: "Pan India", label: "Coverage" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-heading text-xl md:text-2xl font-bold text-primary">
                    {stat.val}
                  </div>
                  <div className="text-xs text-foreground/50 font-sans uppercase tracking-wide mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2,
            ease: "easeInOut",
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground/40 pointer-events-none"
        >
          <span className="text-xs font-sans uppercase tracking-widest">
            Scroll
          </span>
          <ChevronRight className="w-4 h-4 rotate-90" />
        </motion.div>
      </section>

      {/* ── LUXURY BUS SECTION ── */}
      <section
        id="luxury-bus"
        data-ocid="luxury_bus.section"
        className="py-24 md:py-32 bg-background"
      >
        <div className="container mx-auto px-4 md:px-8">
          {/* Section header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeUpVariants}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-heading font-bold uppercase tracking-widest mb-4"
            >
              <Bus className="w-3 h-3 shrink-0" />
              Luxury Travel
            </motion.span>
            <motion.h2
              variants={fadeUpVariants}
              className="font-display text-3xl md:text-5xl font-bold gold-gradient-text mb-4"
            >
              Luxzuri Bus — Volvo 9600
            </motion.h2>
            <motion.p
              variants={fadeUpVariants}
              className="text-foreground/65 text-base md:text-lg max-w-2xl mx-auto"
            >
              Experience the pinnacle of road travel. Our Volvo 9600 fleet
              redefines comfort, safety, and style on every journey.
            </motion.p>
          </motion.div>

          {/* Image gallery */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-2 gap-6 mb-16"
          >
            <motion.div
              variants={fadeUpVariants}
              className="relative group overflow-hidden rounded-2xl"
            >
              <img
                src="/assets/generated/volvo9600_luxury.dim_1200x700.jpg"
                alt="Volvo 9600 Exterior"
                className="w-full h-64 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="font-heading text-sm font-bold text-primary uppercase tracking-wider bg-background/70 backdrop-blur-sm px-3 py-1 rounded-md">
                  Exterior — Volvo 9600
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUpVariants}
              className="relative group overflow-hidden rounded-2xl"
            >
              <img
                src="/assets/generated/volvo9600_interior.dim_1200x700.jpg"
                alt="Volvo 9600 Interior"
                className="w-full h-64 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="font-heading text-sm font-bold text-primary uppercase tracking-wider bg-background/70 backdrop-blur-sm px-3 py-1 rounded-md">
                  Premium Interior
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Feature grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12"
          >
            {busFeatures.map((feature) => (
              <motion.div
                key={feature.label}
                variants={fadeUpVariants}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary group-hover:bg-primary/25 transition-colors shrink-0">
                  {feature.icon}
                </div>
                <span className="font-heading text-sm font-semibold text-foreground/90 leading-tight">
                  {feature.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <Button
              type="button"
              onClick={() => scrollToSection("contact")}
              size="lg"
              className="bg-primary text-primary-foreground font-heading font-bold px-10 py-3 text-base shadow-gold hover:bg-gold-light transition-all duration-300"
            >
              Book Your Journey <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Gold divider */}
      <div className="gold-divider opacity-40" />

      {/* ── FARE CALCULATOR SECTION ── */}
      <section
        id="fare-calculator"
        data-ocid="fare_calculator.section"
        className="py-24 md:py-32 bg-background"
      >
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <motion.span
              variants={fadeUpVariants}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-heading font-bold uppercase tracking-widest mb-4"
            >
              <Calculator className="w-3 h-3 shrink-0" />
              Estimate Your Trip
            </motion.span>
            <motion.h2
              variants={fadeUpVariants}
              className="font-display text-3xl md:text-5xl font-bold gold-gradient-text mb-4"
            >
              Fare Calculator
            </motion.h2>
            <motion.p
              variants={fadeUpVariants}
              className="text-foreground/65 text-base md:text-lg max-w-xl mx-auto"
            >
              Get an instant fare estimate for your journey. Enter the distance
              and we'll calculate the cost for you.
            </motion.p>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-lg mx-auto"
          >
            <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-navy">
              {/* Rate badge */}
              <div className="flex items-center justify-center mb-8">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/15 border border-primary/30">
                  <Calculator className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-heading text-sm font-bold text-primary uppercase tracking-wider">
                    Rate: ₹5 per km
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {/* Distance input */}
                <div>
                  <Label
                    htmlFor="distance"
                    className="font-heading text-sm font-semibold text-foreground/80 mb-2 block"
                  >
                    Distance (in kilometers)
                  </Label>
                  <div className="relative">
                    <Input
                      id="distance"
                      data-ocid="fare_calculator.distance.input"
                      type="number"
                      min={1}
                      placeholder="Enter distance in km (e.g. 150)"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      className="bg-input border-border focus-visible:ring-primary font-sans text-lg pr-12 h-12"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 font-heading text-sm font-semibold pointer-events-none">
                      km
                    </span>
                  </div>
                </div>

                {/* ── SEAT SELECTION ── */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="font-heading text-sm font-semibold text-foreground/80">
                      Select Your Seat(s)
                    </Label>
                    <span className="text-xs font-heading font-bold text-primary bg-primary/10 border border-primary/25 px-2.5 py-1 rounded-full">
                      {selectedSeats.length} seat
                      {selectedSeats.length !== 1 ? "s" : ""} selected
                    </span>
                  </div>

                  {/* Bus front indicator */}
                  <div className="flex items-center justify-center mb-3">
                    <div className="flex items-center gap-2 px-4 py-1 rounded-t-xl bg-primary/10 border border-b-0 border-primary/20">
                      <Bus className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="text-xs font-heading font-semibold text-primary/80 uppercase tracking-wider">
                        Front
                      </span>
                    </div>
                  </div>

                  {/* Seat grid */}
                  <div className="rounded-xl border border-border bg-background/40 p-3 overflow-x-auto">
                    {/* Column headers */}
                    <div className="flex items-center mb-2 min-w-[200px]">
                      <div className="w-6 shrink-0" />
                      <div className="flex gap-1.5 flex-1">
                        <div className="flex gap-1.5 flex-1">
                          <span className="flex-1 text-center text-xs text-foreground/40 font-heading font-semibold">
                            A
                          </span>
                          <span className="flex-1 text-center text-xs text-foreground/40 font-heading font-semibold">
                            B
                          </span>
                        </div>
                        <div className="w-5 shrink-0" />
                        <div className="flex gap-1.5 flex-1">
                          <span className="flex-1 text-center text-xs text-foreground/40 font-heading font-semibold">
                            C
                          </span>
                          <span className="flex-1 text-center text-xs text-foreground/40 font-heading font-semibold">
                            D
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 min-w-[200px]">
                      {seatRows.map((row) => (
                        <div
                          key={row.row}
                          className="flex items-center gap-1.5"
                        >
                          {/* Row number */}
                          <div className="w-6 text-center text-xs text-foreground/30 font-sans shrink-0">
                            {row.row}
                          </div>

                          {/* Left seats (A, B) */}
                          <div className="flex gap-1.5 flex-1">
                            {row.left.map((seatNum, colIdx) => {
                              const state = getSeatState(seatNum);
                              const ocidIndex = (row.row - 1) * 4 + colIdx + 1;
                              return (
                                <button
                                  key={seatNum}
                                  type="button"
                                  data-ocid={`fare_calculator.seat.${ocidIndex}`}
                                  disabled={state === "unavailable"}
                                  onClick={() => toggleSeat(seatNum)}
                                  title={
                                    state === "unavailable"
                                      ? `Seat ${seatNum} — Unavailable`
                                      : state === "selected"
                                        ? `Seat ${seatNum} — Selected (click to deselect)`
                                        : `Seat ${seatNum} — Available`
                                  }
                                  className={[
                                    "flex-1 h-8 rounded-md text-xs font-heading font-bold transition-all duration-150 border",
                                    state === "selected"
                                      ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105"
                                      : state === "unavailable"
                                        ? "bg-muted/50 text-foreground/25 border-border/30 cursor-not-allowed"
                                        : "bg-card text-foreground/70 border-border hover:border-primary/60 hover:text-primary hover:bg-primary/10 cursor-pointer",
                                  ].join(" ")}
                                >
                                  {seatNum}
                                </button>
                              );
                            })}
                          </div>

                          {/* Aisle gap */}
                          <div className="w-5 shrink-0 flex items-center justify-center">
                            <div className="w-px h-full bg-border/40" />
                          </div>

                          {/* Right seats (C, D) */}
                          <div className="flex gap-1.5 flex-1">
                            {row.right.map((seatNum, colIdx) => {
                              const state = getSeatState(seatNum);
                              const ocidIndex = (row.row - 1) * 4 + colIdx + 3;
                              return (
                                <button
                                  key={seatNum}
                                  type="button"
                                  data-ocid={`fare_calculator.seat.${ocidIndex}`}
                                  disabled={state === "unavailable"}
                                  onClick={() => toggleSeat(seatNum)}
                                  title={
                                    state === "unavailable"
                                      ? `Seat ${seatNum} — Unavailable`
                                      : state === "selected"
                                        ? `Seat ${seatNum} — Selected (click to deselect)`
                                        : `Seat ${seatNum} — Available`
                                  }
                                  className={[
                                    "flex-1 h-8 rounded-md text-xs font-heading font-bold transition-all duration-150 border",
                                    state === "selected"
                                      ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105"
                                      : state === "unavailable"
                                        ? "bg-muted/50 text-foreground/25 border-border/30 cursor-not-allowed"
                                        : "bg-card text-foreground/70 border-border hover:border-primary/60 hover:text-primary hover:bg-primary/10 cursor-pointer",
                                  ].join(" ")}
                                >
                                  {seatNum}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded border border-border bg-card" />
                      <span className="text-xs text-foreground/50 font-sans">
                        Available
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded border border-primary bg-primary" />
                      <span className="text-xs text-foreground/50 font-sans">
                        Selected
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded border border-border/30 bg-muted/50" />
                      <span className="text-xs text-foreground/50 font-sans">
                        Unavailable
                      </span>
                    </div>
                  </div>
                </div>
                {/* ── END SEAT SELECTION ── */}

                {/* Result display */}
                <AnimatePresence mode="wait">
                  {distance && Number(distance) > 0 ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 16, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.97 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      data-ocid="fare_calculator.success_state"
                      className="rounded-xl bg-primary/10 border border-primary/30 p-6 text-center"
                    >
                      <div className="text-xs font-heading font-bold text-primary/70 uppercase tracking-widest mb-2">
                        Estimated Fare
                      </div>
                      <div className="font-display text-5xl font-bold gold-gradient-text mb-1">
                        ₹{fare.toLocaleString("en-IN")}
                      </div>
                      <div className="text-sm text-foreground/55 font-sans mt-3">
                        {seatCount} seat{seatCount !== 1 ? "s" : ""} ×{" "}
                        {Number(distance).toLocaleString("en-IN")} km × ₹5/km
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="rounded-xl bg-muted/40 border border-border p-6 text-center"
                    >
                      <div className="text-foreground/35 font-sans text-sm">
                        Enter a distance above to see your fare estimate
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="button"
                  onClick={() => scrollToSection("contact")}
                  size="lg"
                  className="w-full bg-primary text-primary-foreground font-heading font-bold shadow-gold hover:bg-gold-light transition-all duration-300"
                >
                  <Phone className="w-4 h-4 mr-2 shrink-0" />
                  Book This Journey
                </Button>

                <p className="text-center text-xs text-foreground/40 font-sans">
                  * Fare estimate is indicative. Final fare may vary based on
                  route and service type.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gold divider */}
      <div className="gold-divider opacity-40" />

      {/* ── CARGO SECTION ── */}
      <section
        id="cargo"
        data-ocid="cargo.section"
        className="py-24 md:py-32 bg-background"
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-start">
            {/* Image side */}
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="relative pb-14 md:pb-0"
            >
              <div className="relative group overflow-hidden rounded-2xl">
                <img
                  src="/assets/generated/cargo_truck.dim_1200x700.jpg"
                  alt="Kandpal Transport Cargo"
                  className="w-full h-64 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-background/60 via-transparent to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute bottom-0 right-0 md:bottom-6 md:-right-4 bg-primary text-primary-foreground rounded-2xl px-5 py-4 shadow-gold">
                <div className="font-heading text-2xl font-bold">24/7</div>
                <div className="text-xs font-sans uppercase tracking-wide opacity-80 whitespace-nowrap">
                  Service Available
                </div>
              </div>
            </motion.div>

            {/* Content side */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.span
                variants={fadeUpVariants}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-heading font-bold uppercase tracking-widest mb-4"
              >
                <Truck className="w-3 h-3 shrink-0" />
                Freight &amp; Logistics
              </motion.span>
              <motion.h2
                variants={fadeUpVariants}
                className="font-display text-3xl md:text-5xl font-bold gold-gradient-text mb-6 mt-2"
              >
                Cargo Solutions
              </motion.h2>
              <motion.p
                variants={fadeUpVariants}
                className="text-foreground/65 text-base md:text-lg leading-relaxed mb-8"
              >
                Reliable freight services across India. From industrial goods to
                household cargo — we move what matters to you, safely and on
                time.
              </motion.p>

              <div className="space-y-4">
                {cargoServices.map((service) => (
                  <motion.div
                    key={service.title}
                    variants={fadeUpVariants}
                    className="flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary group-hover:bg-primary/25 transition-colors shrink-0 mt-0.5">
                      {service.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-heading text-base font-bold text-foreground mb-1">
                        {service.title}
                      </h3>
                      <p className="text-sm text-foreground/60 leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={fadeUpVariants} className="mt-8">
                <Button
                  type="button"
                  onClick={() => scrollToSection("contact")}
                  size="lg"
                  className="bg-primary text-primary-foreground font-heading font-bold px-8 shadow-gold hover:bg-gold-light transition-all duration-300"
                >
                  Request Cargo Quote <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gold divider */}
      <div className="gold-divider opacity-40" />

      {/* ── CONTACT SECTION ── */}
      <section
        id="contact"
        data-ocid="contact.section"
        className="py-24 md:py-32 bg-background"
      >
        <div className="container mx-auto px-4 md:px-8">
          {/* Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeUpVariants}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-heading font-bold uppercase tracking-widest mb-4"
            >
              <Phone className="w-3 h-3 shrink-0" />
              Get In Touch
            </motion.span>
            <motion.h2
              variants={fadeUpVariants}
              className="font-display text-3xl md:text-5xl font-bold gold-gradient-text mb-4 mt-2"
            >
              Contact Us
            </motion.h2>
            <motion.p
              variants={fadeUpVariants}
              className="text-foreground/65 text-base md:text-lg max-w-xl mx-auto"
            >
              Reach out for bookings, cargo inquiries, or any queries.
              We&apos;re here to help.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 max-w-5xl mx-auto">
            {/* Contact Info */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.h3
                variants={fadeUpVariants}
                className="font-heading text-2xl font-bold text-foreground mb-8"
              >
                Direct Contact
              </motion.h3>

              <div className="space-y-6">
                <motion.a
                  variants={fadeUpVariants}
                  href="tel:7252083527"
                  className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/30 transition-colors shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-foreground/50 font-sans uppercase tracking-wide mb-1">
                      Phone
                    </div>
                    <div className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      7252083527
                    </div>
                  </div>
                </motion.a>

                <motion.a
                  variants={fadeUpVariants}
                  href="mailto:kandpalj57@gmail.com"
                  className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/30 transition-colors shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 overflow-hidden">
                    <div className="text-xs text-foreground/50 font-sans uppercase tracking-wide mb-1">
                      Email
                    </div>
                    <div className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors break-all">
                      kandpalj57@gmail.com
                    </div>
                  </div>
                </motion.a>

                <motion.div
                  variants={fadeUpVariants}
                  className="flex items-center gap-4 p-5 rounded-xl bg-card border border-border"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-foreground/50 font-sans uppercase tracking-wide mb-1">
                      Service Area
                    </div>
                    <div className="font-heading text-base font-bold text-foreground leading-snug">
                      Pan India Routes
                    </div>
                    <div className="text-sm text-foreground/50 leading-snug mt-0.5">
                      Uttarakhand &amp; Major Cities
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Operating hours */}
              <motion.div
                variants={fadeUpVariants}
                className="mt-8 p-5 rounded-xl bg-primary/10 border border-primary/30"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-heading text-sm font-bold text-primary uppercase tracking-wide">
                    Availability
                  </span>
                </div>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  We&apos;re available{" "}
                  <strong className="text-primary">
                    24 hours a day, 7 days a week
                  </strong>{" "}
                  for bookings and cargo inquiries.
                </p>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <h3 className="font-heading text-xl font-bold text-foreground mb-6">
                  Send an Inquiry
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label
                      htmlFor="name"
                      className="font-heading text-sm font-semibold text-foreground/80 mb-2 block"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      data-ocid="contact.name.input"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, name: e.target.value }))
                      }
                      className="bg-input border-border focus-visible:ring-primary font-sans"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="font-heading text-sm font-semibold text-foreground/80 mb-2 block"
                    >
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      data-ocid="contact.phone.input"
                      placeholder="Your phone number"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, phone: e.target.value }))
                      }
                      className="bg-input border-border focus-visible:ring-primary font-sans"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="font-heading text-sm font-semibold text-foreground/80 mb-2 block"
                    >
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      data-ocid="contact.email.input"
                      placeholder="your@email.com"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, email: e.target.value }))
                      }
                      className="bg-input border-border focus-visible:ring-primary font-sans"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="message"
                      className="font-heading text-sm font-semibold text-foreground/80 mb-2 block"
                    >
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      data-ocid="contact.message.textarea"
                      placeholder="Tell us about your travel or cargo requirement..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, message: e.target.value }))
                      }
                      className="bg-input border-border focus-visible:ring-primary font-sans min-h-[120px] resize-none"
                      required
                    />
                  </div>

                  {/* Status messages */}
                  <AnimatePresence mode="wait">
                    {formState === "success" && (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        data-ocid="contact.success_state"
                        className="flex items-center gap-2 p-3 rounded-lg bg-green-900/30 border border-green-500/30 text-green-400 text-sm font-sans"
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        Inquiry submitted successfully! We&apos;ll be in touch
                        soon.
                      </motion.div>
                    )}
                    {formState === "error" && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        data-ocid="contact.error_state"
                        className="flex items-center gap-2 p-3 rounded-lg bg-red-900/30 border border-red-500/30 text-red-400 text-sm font-sans"
                      >
                        <X className="w-4 h-4 shrink-0" />
                        Something went wrong. Please call us directly at
                        7252083527.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Loading state indicator */}
                  {formState === "loading" && (
                    <div
                      data-ocid="contact.loading_state"
                      className="sr-only"
                      aria-live="polite"
                    >
                      Submitting your inquiry...
                    </div>
                  )}

                  <Button
                    type="submit"
                    data-ocid="contact.submit_button"
                    disabled={formState === "loading" || !actor}
                    size="lg"
                    className="w-full bg-primary text-primary-foreground font-heading font-bold shadow-gold hover:bg-gold-light transition-all duration-300"
                  >
                    {formState === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Submit Inquiry
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-card border-t border-border py-10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Bus className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-bold gold-gradient-text whitespace-nowrap">
                Kandpal Transport
              </span>
            </div>

            {/* Nav */}
            <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-foreground/50 hover:text-primary text-sm font-sans transition-colors whitespace-nowrap"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Contact quick */}
            <div className="flex items-center gap-4 text-foreground/50 text-sm shrink-0">
              <a
                href="tel:7252083527"
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                <Phone className="w-3 h-3" /> 7252083527
              </a>
            </div>
          </div>

          <div className="gold-divider opacity-20 my-6" />

          <div className="text-center text-foreground/35 text-xs font-sans">
            &copy; {new Date().getFullYear()} Kandpal Transport. Built with ❤️
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

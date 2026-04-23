import { useEffect, useRef, useState, forwardRef } from 'react';

export const FadeInSection = forwardRef(({ children,className, onVisibilityChange, ...props }, externalRef) => {
    const [isVisible, setVisible] = useState(false);
    const domRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setVisible(entry.isIntersecting);

                    // Якщо передали функцію onVisibilityChange, викликаємо її
                    if (onVisibilityChange) {
                        onVisibilityChange(entry.isIntersecting);
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (domRef.current) observer.observe(domRef.current);

        return () => {
            if (domRef.current) observer.unobserve(domRef.current);
        };
    }, [onVisibilityChange]);

    return (
        <section
            ref={(node) => {
                // Зберігаємо для внутрішньої анімації
                domRef.current = node;

                // Передаємо зовнішній ref (zoneRef), якщо він є
                if (typeof externalRef === 'function') {
                    externalRef(node);
                } else if (externalRef) {
                    externalRef.current = node;
                }
            }}
            className={className}
            style={{
                // Логіка анімації:
                opacity: isVisible ? 1 : 0.2, // Або 0, якщо хочеш повне зникнення
                transition: 'all 0.3s ease-out',
                willChange: 'opacity, transform', // Оптимізація для браузера
            }}
            {...props}
        >
            {/* Твій кастомний контент рендериться тут */}
            {children}
        </section>
    );
});